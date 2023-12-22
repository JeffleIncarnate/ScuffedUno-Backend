/* 
  This is a file to post a user to the database, 
  but it will not verify that user.
*/

import express from "express";
import crypto from "crypto";

import HTTPErrors from "../../../core/errors";
import { pool } from "../../../core/database/prisma";
import { verifyArray } from "../../../core/verifyArray/verifyArray";
import {
   verifyUsername,
   verifyEmail,
   verifyPassword,
} from "../../../core/verifyArray/verify";
import { hashPassword } from "../../../core/argon2/argon2";
import { sendEmail } from "../../../core/nodemailer/nodemailer";
import { createTokenCreateUser } from "../../../core/jwt/jwt";
import { createUserScopes } from "../../../core/data/scopes";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const postUser = express.Router();

postUser.post("/", async (req, res, next) => {
   const { username, email, password } = req.body;

   const didPassCheck = verifyArray({ username, email, password });

   if (!didPassCheck.succeeded) {
      next(new HTTPErrors.DidNotProvideItems(didPassCheck.itemsMissing));
      return;
   }

   if (!verifyUsername(username)) {
      next(new HTTPErrors.InvalidUsername());
      return;
   }

   if (!verifyEmail(email)) {
      next(new HTTPErrors.InvalidEmail());
      return;
   }

   if (!verifyPassword(password)) {
      next(new HTTPErrors.InvalidPassword());
      return;
   }

   const id = crypto.randomUUID();

   // Created At, banned, verified is defaulted.
   const user = {
      id: id,
      username,
      email,
      password: await hashPassword(password),
      token: createTokenCreateUser(id, createUserScopes),
   };

   // If this fails, then we know the username is not unique
   try {
      await pool.user.create({
         data: {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
         },
      });
   } catch (err) {
      if (
         err instanceof PrismaClientKnownRequestError &&
         err.code === "P2002"
      ) {
         next(new HTTPErrors.UsernameConflict());
         return;
      }
   }

   try {
      await sendEmail(user.email, "Verify your account", null, user.token);
   } catch (err) {
      await pool.user.delete({
         where: {
            id: user.id,
         },
      });

      next(new HTTPErrors.NodeEmailerL());
      return;
   }

   return res.status(201).send({
      success: true,
      detail: "User successfully created",
   });
});

export { postUser };
