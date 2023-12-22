/* 
  This is a file to verify a usee from the database,
*/

import express from "express";

import HTTPErrors from "../../../core/errors";
import { pool } from "../../../core/database/prisma";
import { decodeTokenCreateUser } from "../../../core/jwt/jwt";
import { verifyArray } from "../../../core/verifyArray/verifyArray";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const verifyUser = express.Router();

verifyUser.post("/", async (req, res, next) => {
   const { token } = req.body;

   const didPassCheck = verifyArray({ token });

   if (!didPassCheck.succeeded) {
      next(new HTTPErrors.DidNotProvideItems(didPassCheck.itemsMissing));
      return;
   }

   const decoded = decodeTokenCreateUser(token);

   if (!decoded.succeeded) {
      next(new HTTPErrors.JWTError(decoded.error));
      return;
   }

   try {
      await pool.user.update({
         where: {
            id: decoded.uuid,
         },
         data: {
            verified: true,
         },
      });
   } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
         next(new HTTPErrors.UserNotFound());
         return;
      }
   }

   return res.status(201).send("You have been successfully verified");
});

export { verifyUser };
