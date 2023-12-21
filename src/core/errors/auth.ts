import { Error } from "./error";

export class AuthError extends Error {
  constructor() {
    super();
  }

  static youDoNotExist() {
    return {
      success: false,
      details: {
        reason:
          "You do not exist in the database, so you are unable to get a token",
        errorCode: 400,
      },
    };
  }

  static incorrectPassword() {
    return {
      success: false,
      details: {
        reason: "The password you provided is not correct",
        errorCode: 400,
      },
    };
  }

  static notVerified() {
    return {
      success: false,
      details: {
        reason:
          "You are not verified, so you are unable to get an access token. Read the instruction in your email to lean how to verify",
        errorCode: 400,
      },
    };
  }

  static verifyTokenFail() {
    return {
      success: false,
      details: {
        reason: "The token you are using is expired or is invalid",
        errorCode: 400,
      },
    };
  }

  static generalTokenFail() {
    return {
      success: false,
      details: {
        reason: "There was an error with the token verification",
        errorCode: 400,
      },
    };
  }
}
