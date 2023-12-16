import { Error } from "./error";

export class PostError extends Error {
  constructor() {
    super();
  }

  static invalidUsername() {
    return {
      success: false,
      details: {
        reason:
          "The username provided is not valid. Username can not contain spaces or special characters",
        errorCode: 400,
      },
    };
  }

  static invalidEmail() {
    return {
      success: false,
      details: {
        reason: "The email provided is not valid",
        errorCode: 400,
      },
    };
  }

  static invalidPassword() {
    return {
      success: false,
      details: {
        reason:
          "The Password provided is not valid. It must contain at least one of the following letters: Uppercase, lowercase, special character, number. And at least eight characters",
        errorCode: 400,
      },
    };
  }
}
