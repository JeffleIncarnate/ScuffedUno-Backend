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
            errorCode: 401,
         },
      };
   }

   static incorrectPassword() {
      return {
         success: false,
         details: {
            reason: "The password you provided is not correct",
            errorCode: 401,
         },
      };
   }

   static notVerified() {
      return {
         success: false,
         details: {
            reason:
               "You are not verified, so you are unable to get an access token. Read the instruction in your email to lean how to verify",
            errorCode: 401,
         },
      };
   }

   static invalidTokenProvided(reason: string) {
      return {
         success: false,
         details: {
            reason: "The token you provided is not valid",
            error: reason,
            errorCode: 401,
         },
      };
   }

   static tokenNotProvided() {
      return {
         success: false,
         details: {
            reason: "You straight up forgor to provide a token",
            errorCode: 400,
         },
      };
   }

   static generalTokenFail() {
      return {
         success: false,
         details: {
            reason: "There was an error with the token verification",
            errorCode: 500,
         },
      };
   }

   static refreshTokenNotFound() {
      return {
         success: false,
         details: {
            reason:
               "The refresh token provided was not found or has already been used (remember refresh tokens are single use)",
            errorCode: 401,
         },
      };
   }
}
