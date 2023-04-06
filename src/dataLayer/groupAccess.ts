import { Group } from "../models/Group";
import * as AWS from "aws-sdk";

export class GroupAccess {
  constructor(
    private readonly docClient = new AWS.DynamoDB.DocumentClient(),
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
    console.log("groups", JSON.stringify(items));
    return items as Group[];
  }

  async createGroup(group: Group): Promise<Group> {
    console.log(`Creating a group with id ${group.id}`);

    const result = await this.docClient
      .scan({
        TableName: this.groupsTable,
        Item: group,
      })
      .promise();

    const items = result.Items;
    return group;
  }
}
