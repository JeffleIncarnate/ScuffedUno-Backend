export class Error {
  static didNotProvideItems(missing: string[]) {
    return {
      success: false,
      details: {
        reason: "An item was null or undefined, try proving all the items",
        itemsMissing: missing,
        errorCode: 400,
      },
    };
  }

  static prismaError() {
    return {
      success: false,
      details: {
        reason: "Unknown database error",
        errorCode: 500,
      },
    };
  }
}
