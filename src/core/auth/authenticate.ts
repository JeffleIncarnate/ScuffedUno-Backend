import crypto from "crypto";

import express from "express";
import { validateRequest } from "zod-express-middleware";

import HTTPErrors from "../errors";
import { createToken } from "../jwt/jwt";
import { pool } from "../database/prisma";
import { generalScopes } from "../data/scopes";
import { LoginRequest } from "../types/validators";
import { verifyPasswordHash } from "../argon2/argon2";
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from ".";

const login = express.Router();

login.post(
   "/",
   validateRequest({ body: LoginRequest }),
   async (req, res, next) => {
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
         next(new HTTPErrors.PrismaUnknownError());
         return;
      }

      if (user === null) {
         next(new HTTPErrors.YouDoNotExist());
         return;
      }

      if (!user.verified) {
         next(new HTTPErrors.NotVerified());
         return;
      }

      if (!(await verifyPasswordHash(user.password, password))) {
         next(new HTTPErrors.IncorrectPassword());
         return;
      }

      const accessToken = createToken(
         { uuid: user.id, scopes: generalScopes },
         ACCESS_TOKEN_EXPIRY,
      );

      const refreshTokenId = crypto.randomUUID();
      const refreshToken = createToken(
         { uuid: user.id, refreshId: refreshTokenId },
         REFRESH_TOKEN_EXPIRY,
      );
      await pool.refereshToken.create({
         data: {
            id: refreshTokenId,
         },
      });

      return res.send({
         success: true,
         accessToken,
         refreshToken,
      });
   },
);

export { login };
