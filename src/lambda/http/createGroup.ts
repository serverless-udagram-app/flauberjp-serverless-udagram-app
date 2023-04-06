import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";
import "source-map-support/register";
import * as AWS from "aws-sdk";
import * as uuid from "uuid";
import { getJwtToken, getUserId } from "../../auth/utils";
import { createGroup } from "../../businessLogic/groups";
import { CreateGroupRequest } from "../../requests/CreateGroupRequest";

const docClient = new AWS.DynamoDB.DocumentClient();
const groupsTable = process.env.GROUPS_TABLE;

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Processing event: ", event);

  const newGroup: CreateGroupRequest = JSON.parse(event.body);
  const authorization = event.headers.Authorization;
  const jwtToken = getJwtToken(authorization);

  const newItem = await createGroup(newGroup, jwtToken);

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      newItem,
    }),
  };
};
