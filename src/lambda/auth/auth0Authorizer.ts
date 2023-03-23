import {
  CustomAuthorizerEvent,
  CustomAuthorizerResult,
  CustomAuthorizerHandler,
} from "aws-lambda";
import "source-map-support/register";
import { verify } from "jsonwebtoken";
import { JwtToken } from "../../auth/JWTToken";
import * as AWS from "aws-sdk";

const secretId = process.env.AUTH_0_SECRET_ID || "";
const secretField = process.env.AUTH_0_SECRET_FIELD || "";

const client = new AWS.SecretsManager();

// Cache secret if a lambda instance is reused
let cachedSecret: string;

export const handler: CustomAuthorizerHandler = async (
  event: CustomAuthorizerEvent,
  context
): Promise<CustomAuthorizerResult> => {
  try {
    const decodedToken = await verifyToken(event.authorizationToken);
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

async function verifyToken(authHeader: string | undefined): Promise<JwtToken> {
  if (!authHeader) {
    throw new Error("No Authorization Header.");
  }

  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    throw new Error("Invalid Authorization Header.");
  }

  const split = authHeader.split(" ");
  const token = split[1];
  console.log("token", token);

  console.log("secretId", secretId);
  const secretObject: any = await getSecret();
  console.log("secretObject", JSON.stringify(secretObject));
  console.log("secretField", secretField);
  const secret = secretObject[secretField];
  console.log("secret", secret);

  return verify(token, secret) as JwtToken;
}

async function getSecret() {
  if (cachedSecret) {
    return cachedSecret;
  }

  const data = await client.getSecretValue({ SecretId: secretId }).promise();

  return JSON.parse(cachedSecret);
}
