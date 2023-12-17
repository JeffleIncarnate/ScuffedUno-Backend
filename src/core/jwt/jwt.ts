import jwt from "jsonwebtoken";

/**
 * This is a function to create a token for a user who needs to be verified
 * @param uuid
 * @returns Token
 */
function createTokenCreateUser(uuid: string): string {
  return jwt.sign({ uuid }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
}

export { createTokenCreateUser };
