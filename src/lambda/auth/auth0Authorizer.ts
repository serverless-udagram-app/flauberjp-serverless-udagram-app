import {
  CustomAuthorizerEvent,
  CustomAuthorizerResult,
  CustomAuthorizerHandler,
} from "aws-lambda";
import "source-map-support/register";

export const handler: CustomAuthorizerHandler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    verifyToken(event.authorizationToken);
    console.log("User was authorized!");
    return {
      principalId: "user",
      Statement: [
        {
          action: "execute-api:Invoke",
          Effect: "Allow",
          Resource: "*",
        },
      ],
    };
  } catch (e) {
    console.log("User was not authorized", e.message);
    return {
      principalId: "user",
      Statement: [
        {
          action: "execute-api:Invoke",
          Effect: "Deny",
          Resource: "*",
        },
      ],
    };
  }
};

function verifyToken(authorizationToken: string | undefined) {
  throw new Error("Function not implemented.");
}
