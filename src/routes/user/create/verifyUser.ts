/* 
  This is a file to verify a usee from the database,
*/

import express from "express";

import { verifyArray } from "../../../core/verifyArray/verifyArray";
import { PostError } from "../../../core/errors/post";
import { decodeTokenCreateUser } from "../../../core/jwt/jwt";
import { pool } from "../../../core/database/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const verifyUser = express.Router();

verifyUser.post("/", async (req, res) => {
   const { token } = req.body;

   const didPassCheck = verifyArray({ token });

   if (!didPassCheck.succeeded) {
      return res
         .status(
            PostError.didNotProvideItems(didPassCheck.itemsMissing).details
               .errorCode,
         )
         .send(PostError.didNotProvideItems(didPassCheck.itemsMissing).details);
   }

   const decoded = decodeTokenCreateUser(token);

   if (!decoded.succeeded) {
      return res
         .status(PostError.jwtError(decoded.error).details.errorCode)
         .send(PostError.jwtError(decoded.error).details);
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
         return res
            .status(PostError.userNotFound().details.errorCode)
            .send(PostError.userNotFound().details);
      }
   }

   return res.status(201).send("You have been successfully verified");
});

export { verifyUser };
