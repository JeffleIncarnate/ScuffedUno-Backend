/* 
  This is a file to post a user to the database, 
  but it will not verify that user.
*/

import express from "express";
import crypto from "crypto";

import { pool } from "../../core/database/prisma";
import { verifyArray } from "../../core/verifyArray/verifyArray";
import { PostError } from "../../core/errors/post";
import {
  verifyUsername,
  verifyEmail,
  verifyPassword,
} from "../../core/verifyArray/verify";
import { hashPassword } from "../../core/argon2/argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { sendEmail } from "../../core/nodemailer/nodemailer";
import { createTokenCreateUser } from "../../core/jwt/jwt";
import { createUserScopes } from "../../core/data/scopes";

const postUser = express.Router();

postUser.post("/", async (req, res) => {
  const { username, email, password } = req.body;

  const didPassCheck = verifyArray({ username, email, password });

  if (!didPassCheck.succeded) {
    return res
      .status(
        PostError.didNotProideItems(didPassCheck.itemsMissing).details.errorCode
      )
      .send(PostError.didNotProideItems(didPassCheck.itemsMissing).details);
  }

  if (!verifyUsername(username)) {
    return res
      .status(PostError.invalidUsername().details.errorCode)
      .send(PostError.invalidUsername());
  }

  if (!verifyEmail(email)) {
    return res
      .status(PostError.invalidEmail().details.errorCode)
      .send(PostError.invalidEmail());
  }

  if (!verifyPassword(password)) {
    return res
      .status(PostError.invalidPassword().details.errorCode)
      .send(PostError.invalidPassword());
  }

  const id = crypto.randomUUID();

  // Cretaed At, banned, verified is defaulted.
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
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res
          .status(PostError.usernameAlreadyExists().details.errorCode)
          .send(PostError.usernameAlreadyExists().details);
      }
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

    return res
      .status(PostError.nodemailerL().details.errorCode)
      .send(PostError.nodemailerL().details);
  }

  return res.status(201).send({
    detail: "User successfuly created",
  });
});

export { postUser };
