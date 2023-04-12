import { Group } from "../models/Group";
import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";

const XAWS = AWSXRay.captureAWS(AWS);

export class GroupAccess {
  constructor(
    private readonly docClient = createDynamoDBClient(),
    private readonly groupsTable = process.env.GROUPS_TABLE
  ) {}

  async getAllGroups(): Promise<Group[]> {
    console.log("Getting all groups");
    console.log("groupsTable", this.groupsTable);

    const result = await this.docClient
      .scan({
        TableName: this.groupsTable,
      })
      .promise();
    const items = result.Items;
    console.log("Groups", JSON.stringify(items));
    return items as Group[];
  }

  async createGroup(group: Group): Promise<Group> {
    console.log(`Creating a group with id ${group.id}`);

    await this.docClient
      .put({
        TableName: this.groupsTable,
        Item: group,
      })
      .promise();

    console.info("Group", group);
    return group;
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE === "true") {
    console.log("Creating a local DynamoDB instance");
    return new AWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    });
  }
  console.log("Creating an AWS DynamoDB instance");
  return new XAWS.DynamoDB.DocumentClient();
}
