import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";

interface ReturnDecodeTokenCreateUser {
  succeeded: boolean;
  uuid: string;
  error: string;
}

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

/**
 * This is a function to verify a token and return the uuid or the error that has arose
 * @param token
 * @returns Object
 */
function decodeTokenCreateUser(token: string): ReturnDecodeTokenCreateUser {
  try {
    const { uuid } = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;

    return {
      succeeded: true,
      uuid: uuid,
      error: "",
    };
  } catch (err) {
    if (err instanceof JsonWebTokenError) {
      return {
        succeeded: false,
        error: err.message,
        uuid: "",
      };
    } else if (err instanceof TokenExpiredError) {
      return {
        succeeded: false,
        error: err.message,
        uuid: "",
      };
    } else {
      return {
        succeeded: false,
        error: "Unknown JWT error",
        uuid: "",
      };
    }
  }
}

export { createTokenCreateUser, decodeTokenCreateUser };
