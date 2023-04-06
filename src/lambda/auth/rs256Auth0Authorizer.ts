import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";

import { verify } from "jsonwebtoken";
import { getJwtToken, getUserId } from "../../auth/utils";

const cert = `...`;

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = getJwtToken(event.authorizationToken);
    verifyToken(jwtToken);
    const userId = getUserId(jwtToken);

    console.log("User was authorized!");
    return {
      principalId: userId,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
  } catch (e) {
    console.log("User was not authorized", e.message);
    return {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
  }
};

function verifyToken(token: string): void {
  verify(
    token,
    cert, // A certificate copied from Auth0 website
    { algorithms: ["RS256"] } // We need to specify that we use the RS256 algorithm
  );
}
