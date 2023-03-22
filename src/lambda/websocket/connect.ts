import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";
import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();
const connectionsTable = process.env.CONNECTIONS_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Websocket connection", event);

  const connectionId = event.requestContext.connectionId;
  const timestamp = new Date().toISOString();

  const item = {
    id: connectionId,
    timestamp,
  };

  await docClient
    .put({
      TableName: connectionsTable,
      Item: item,
    })
    .promise();

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      item,
    }),
  };
};
