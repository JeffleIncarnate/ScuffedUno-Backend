import jwt, { JsonWebTokenError, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import HTTPErrors from "../errors";
import { AccessTokenValidator, AccessToken } from "../types/validators";

export function isAccessToken(
   token_data: string | JwtPayload,
): token_data is AccessToken {
   return AccessTokenValidator.safeParse(token_data).success;
}

export function authorizeRequest(
   req: Request,
   res: Response,
   next: NextFunction,
) {
   const auth_header = req.headers["authorization"];
   const token = auth_header && auth_header.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"

   if (token === undefined) {
      next(new HTTPErrors.TokenNotProvided());
      return;
   }

   let token_data;
   try {
      token_data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   } catch (err) {
      if (!(err instanceof JsonWebTokenError)) {
         next(new HTTPErrors.GeneralTokenFail());
         return;
      }

      next(new HTTPErrors.InvalidTokenProvided(err.message));
      return;
   }

   if (!isAccessToken(token_data)) {
      next(
         new HTTPErrors.InvalidTokenProvided(
            "The token you provided is not an access token, probably a refresh token",
         ),
      );
      return;
   }

   // i think this should be renamed to req.token
   req.user = token_data;
   next();
}
