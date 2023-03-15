import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";
import * as AWS from "aws-sdk";
import * as uuid from "uuid";

const docClient = new AWS.DynamoDB.DocumentClient();

export const s3 = new AWS.S3({
  signatureVersion: "v4",
});

const groupsTable = process.env.GROUPS_TABLE;
const imagesTable = process.env.IMAGES_TABLE;
const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpirationInMinutes = parseInt(
  process.env.SIGNED_URL_EXPIRATION_IN_MINUTES
);
console.log("urlExpirationInMinutes", urlExpirationInMinutes);

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Caller event", event);
  const groupId = event.pathParameters.groupId;
  const validGroupId = await groupExists(groupId);

  if (!validGroupId) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Group does not exist",
      }),
    };
  }

  const imageId = uuid.v4();
  const parsedBody = JSON.parse(event.body);

  const newItem = {
    imageId: imageId,
    groupId: groupId,
    timestamp: new Date().toString(),
    ...parsedBody,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`,
  };

  await docClient
    .put({
      TableName: imagesTable,
      Item: newItem,
    })
    .promise();

  const url = getUploadUrl(imageId);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url,
    }),
  };
};

async function groupExists(groupId: string) {
  const result = await docClient
    .get({
      TableName: groupsTable,
      Key: {
        id: groupId,
      },
    })
    .promise();

  console.log("Get group: ", result);
  return !!result.Item;
}

function getUploadUrl(key: string) {
  const param = {
    Bucket: bucketName,
    Key: key,
    Expires: 60 * urlExpirationInMinutes,
  };

  const url = s3.getSignedUrl("putObject", param);

  return url;
}
