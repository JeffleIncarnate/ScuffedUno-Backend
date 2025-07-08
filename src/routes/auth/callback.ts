import express from "express";
import { google } from "googleapis";
import { z } from "zod";
import { Prisma } from "@prisma/client";

import { prisma } from "../../core/db/prisma";
import { fetchUserInfo } from "../../core/requests/fetch-user-info";
import { CustomError } from "../../core/error/custom/error";
import { validateToken, validateUser } from "../../core/utils/validators";
import { createAccessToken, createRefreshToken } from "../../core/utils/jwt";

const router = express.Router();

router.get("/", async (req, res, next) => {
  const code = z.string().safeParse(req.query.code);

  if (!code.success) {
    return next(new CustomError("zod", code.error.message, 400, undefined));
  }

  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  let tokens;
  try {
    tokens = (await oAuth2Client.getToken(code.data)).res?.data;
  } catch (err) {
    if (err instanceof Error) {
      return next(new CustomError("google", err.message, 500, err.stack));
    }
  }
  const verifiedTokens = validateToken.safeParse(tokens);
  if (!verifiedTokens.success) {
    return next(
      new CustomError("auth", verifiedTokens.error.message, 500, undefined)
    );
  }

  let user;
  try {
    user = (await fetchUserInfo(verifiedTokens.data.access_token)).json();
  } catch (err) {
    if (err instanceof Error) {
      return next(new CustomError("google", err.message, 500, err.stack));
    }
  }

  const verifiedUser = validateUser.safeParse(await user);
  if (!verifiedUser.success) {
    return next(
      new CustomError("auth", verifiedUser.error.message, 500, undefined)
    );
  }

  let createdUser;

  try {
    createdUser = await prisma.user.create({
      data: {
        displayName: "",
        firstname: verifiedUser.data.given_name,
        lastname: verifiedUser.data.family_name,
        photo: verifiedUser.data.picture,
        email: verifiedUser.data.email,
        account: {
          create: {
            accessToken: verifiedTokens.data.access_token,
            refreshToken: verifiedTokens.data.refresh_token,
            scope: verifiedTokens.data.scope,
            tokenType: verifiedTokens.data.token_type,
            idToken: verifiedTokens.data.id_token,
            expiryDate: verifiedTokens.data.expiry_date,
          },
        },
      },
      select: {
        id: true,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      // If this is an error, we know that the user already exists, so we make cookies and send them to the client :)
      const userId = await prisma.user.findUnique({
        where: {
          email: verifiedUser.data.email,
        },
        select: {
          id: true,
        },
      });

      if (!userId) {
        return next(
          new CustomError(
            "prisma",
            "id undefined when attempting to create tokens",
            500,
            undefined
          )
        );
      }

      const accessToken = createAccessToken(userId.id);
      const refreshToken = createRefreshToken(userId.id);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      return res.redirect(`${process.env.CLIENT_URL}`);
    } else {
      console.error(err);
      throw err;
    }
  }

  // Now we know the user is a first time user. We will create a token, and redirect them to the onboarding page. with ?token=<token>

  res.sendStatus(200);
  return;
});

export { router };
