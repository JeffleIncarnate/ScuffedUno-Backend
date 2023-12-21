import express from "express";
import { validateRequest } from "zod-express-middleware";

import { createToken } from "../jwt/jwt";
import { pool } from "../database/prisma";
import { AuthError } from "../errors/auth";
import { generalScopes } from "../data/scopes";
import { LoginRequest } from "../types/validators";
import { verifyPasswordHash } from "../argon2/argon2";

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

const login = express.Router();

login.post("/", validateRequest({ body: LoginRequest }), async (req, res) => {
   const { username, password } = req.body;

   let user;
   try {
      user = await pool.user.findUnique({
         where: {
            username: username,
         },
         select: {
            password: true,
            id: true,
            verified: true,
         },
      });
   } catch (err) {
      return res
         .status(AuthError.prismaError().details.errorCode)
         .send(AuthError.prismaError().details);
   }

   if (user === null) {
      return res
         .status(AuthError.youDoNotExist().details.errorCode)
         .send(AuthError.youDoNotExist().details);
   }

   if (!user.verified) {
      return res
         .status(AuthError.notVerified().details.errorCode)
         .send(AuthError.notVerified().details);
   }

   if (!(await verifyPasswordHash(user.password, password))) {
      return res
         .status(AuthError.incorrectPassword().details.errorCode)
         .send(AuthError.incorrectPassword().details);
   }

   const accessToken = createToken(
      { uuid: user.id, scopes: generalScopes },
      ACCESS_TOKEN_EXPIRY,
   );

   const refreshToken = createToken({ uuid: user.id }, REFRESH_TOKEN_EXPIRY);

   return res.send({
      success: true,
      accessToken,
      refreshToken,
   });
});

export { login };