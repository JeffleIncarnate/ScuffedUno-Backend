import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import HTTPErrors from "../errors";
import { IScopes } from "../data/scopes";

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
      next(new HTTPErrors.TokenNotProvided());
      return;
   }

   let user;
   try {
      user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   } catch (err) {
      if (!(err instanceof JsonWebTokenError)) {
         next(new HTTPErrors.GeneralTokenFail());
         return;
      }

      next(new HTTPErrors.InvalidTokenProvided(err.message));
      return;
   }

   req.user = user as IToken;
   next();
}
