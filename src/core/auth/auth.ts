import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import { IScopes } from "../data/scopes";
import { AuthError } from "../errors/auth";

interface IToken {
   uuid: string;
   scopes: IScopes;
   iat: number;
   exp: number;
}

export function authorizeRequest(
   req: Request,
   res: Response,
   next: NextFunction,
) {
   const auth_header = req.headers["authorization"];
   const token = auth_header && auth_header.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"

   if (token === undefined) {
      const error = AuthError.tokenNotProvided();
      return res.status(error.details.errorCode).send(error);
   }

   let user;
   try {
      user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   } catch (err) {
      if (!(err instanceof JsonWebTokenError)) {
         const error = AuthError.generalTokenFail();
         return res.status(error.details.errorCode).send(error);
      }

      const error = AuthError.invalidTokenProvided(err.message);
      return res.status(error.details.errorCode).send(error);
   }

   req.user = user as IToken;
   next();
}
