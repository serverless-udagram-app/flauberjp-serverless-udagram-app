import { CreateGroupRequest } from "./../requests/CreateGroupRequest";
import "source-map-support/register";
import * as uuid from "uuid";
import { GroupAccess } from "../dataLayer/groupAccess";
import { Group } from "../models/Group";
import { getUserId } from "../auth/utils";

const groupAccess = new GroupAccess();

export async function getAllGroups(): Promise<Group[]> {
  return groupAccess.getAllGroups();
}
export async function createGroup(
  createGroupRequest: CreateGroupRequest,
  JwtToken: string
): Promise<Group> {
  const itemId = uuid.v4();
  const userId = getUserId(JwtToken);

  return await groupAccess.createGroup({
    id: itemId,
    userId: userId,
    name: createGroupRequest.name,
    description: createGroupRequest.description,
  });
}
