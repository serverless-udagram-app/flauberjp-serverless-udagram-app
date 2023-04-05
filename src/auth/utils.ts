import { decode } from "jsonwebtoken";

import { JwtToken } from "./JwtToken";

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function getUserId(jwtToken: string): string {
  const decodedJwt = decode(jwtToken) as JwtToken;
  return decodedJwt.sub;
}

export function getJwtToken(authHeader: string | undefined): string {
  if (!authHeader) {
    throw new Error("No Authorization Header.");
  }

  if (!authHeader.toLowerCase().startsWith("bearer ")) {
    throw new Error("Invalid Authorization Header.");
  }

  const split = authHeader.split(" ");
  const token = split[1];
  console.log("token", token);
  return token;
}
