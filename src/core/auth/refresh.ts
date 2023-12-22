import crypto from "crypto";

import { z } from "zod";
import express from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { validateRequest } from "zod-express-middleware";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import HTTPErrors from "../errors";
import { createToken } from "../jwt/jwt";
import { pool } from "../database/prisma";
import { generalScopes } from "../data/scopes";
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from ".";

interface RefreshTokenData {
   uuid: string;
   refreshId: string;
   iat: number;
   exp: number;
}

export const refreshTokenRoute = express.Router();

refreshTokenRoute.post(
   "/",
   validateRequest({
      body: z.object({
         refreshToken: z.string({
            required_error:
               "Please provide the refresh token that was issued with the access token",
         }),
      }),
   }),
   async (req, res, next) => {
      let oldRefreshToken: RefreshTokenData;
      try {
         oldRefreshToken = jwt.verify(
            req.body.refreshToken,
            process.env.ACCESS_TOKEN_SECRET,
         ) as RefreshTokenData;
      } catch (err) {
         if (!(err instanceof JsonWebTokenError)) {
            next(new HTTPErrors.GeneralTokenFail());
            return;
         }

         next(new HTTPErrors.InvalidTokenProvided(err.message));
         return;
      }

      try {
         await pool.refereshToken.delete({
            where: {
               id: oldRefreshToken.refreshId,
            },
         });
      } catch (err) {
         if (
            err instanceof PrismaClientKnownRequestError &&
            err.code === "P2025"
         ) {
            next(new HTTPErrors.RefreshTokenNotFound());
            return;
         }

         next(new HTTPErrors.PrismaUnknownError());
         return;
      }

      const userId = oldRefreshToken.uuid;

      const accessToken = createToken(
         { uuid: userId, scopes: generalScopes },
         ACCESS_TOKEN_EXPIRY,
      );

      const refreshTokenId = crypto.randomUUID();
      const refreshToken = createToken(
         { uuid: userId, refreshId: refreshTokenId },
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
