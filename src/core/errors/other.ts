import { HTTPError } from "./base_error";

export class DidNotProvideItems extends HTTPError {
   constructor(missing: string[]) {
      super(404, {
         reason: "An item was null or undefined, try proving all the items",
         itemsMissing: missing,
         errorCode: 400,
      });
   }
}

export class RefreshTokenNotFound extends HTTPError {
   constructor() {
      super(401, {
         reason:
            "The refresh token provided was not found or has already been used (remember refresh tokens are single use)",
      });
   }
}

export class PrismaUnknownError extends HTTPError {
   constructor() {
      super(500, {
         reason: "Unknown database error",
      });
   }
}
