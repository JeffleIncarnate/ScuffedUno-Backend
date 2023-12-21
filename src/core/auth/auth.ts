import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { IScopes } from "../data/scopes";
import { AuthError } from "../errors/auth";

interface IToken {
   uuid: string;
   scopes: IScopes;
   iat: number;
   exp: number;
}

function authToken(req: Request, res: Response, next: NextFunction) {
   const auth_header = req.headers["authorization"];
   const token = auth_header && auth_header.split(" ")[1]; // Splitting because it goes: "Bearer [space] TOKEN"

   if (token === null || token === undefined) return res.sendStatus(401);

   try {
      const user: IToken = jwt.verify(
         token,
         process.env.ACCESS_TOKEN_SECRET as string,
      ) as IToken;

      req.user = user;
      next();
   } catch (err) {
      if (err instanceof JsonWebTokenError) {
         return res
            .status(AuthError.verifyTokenFail().details.errorCode)
            .send(AuthError.verifyTokenFail());
      } else {
         return res
            .status(AuthError.generalTokenFail().details.errorCode)
            .send(AuthError.generalTokenFail());
      }
   }
}

export { authToken };
