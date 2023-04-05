import { CustomAuthorizerEvent, CustomAuthorizerResult } from "aws-lambda";
import "source-map-support/register";

import { verify } from "jsonwebtoken";
import { JwtToken } from "../../auth/JWTToken";

const cert = `...`;

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    const decodedToken = verifyToken(event.authorizationToken);
    console.log("User was authorized!");
    return {
      principalId: decodedToken.sub,
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

function verifyToken(authHeader: string | undefined): JwtToken {
  if (!authHeader) {
    throw new Error("No Authorization Header.");
  }

  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    throw new Error("Invalid Authorization Header.");
  }

  const split = authHeader.split(" ");
  const token = split[1];
  console.log("token", token);

  return verify(
    token,
    cert, // A certificate copied from Auth0 website
    { algorithms: ["RS256"] } // We need to specify that we use the RS256 algorithm
  ) as JwtToken;
}
