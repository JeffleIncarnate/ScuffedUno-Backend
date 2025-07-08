import express from "express";
import cookieParser from "cookie-parser";

import { prisma } from "../../../core/db/prisma";
import {
  validateAccessToken,
  validateCookies,
} from "../../../core/utils/validators";
import { CustomError } from "../../../core/error/custom/error";
import { decryptAccessToken } from "../../../core/utils/jwt";
import { authorize } from "../../../core/auth/authorize";

const router = express.Router();

router.get("/", cookieParser(), authorize, async (req, res, next) => {
  const cookies = validateCookies.safeParse(req.cookies);

  if (!cookies.success) {
    next(new CustomError("zod", cookies.error.message, 400, undefined));
    return;
  }
  console.log("e");

  const decrypt = validateAccessToken.safeParse(
    decryptAccessToken(cookies.data.accessToken)
  );

  let user;

  if (!decrypt.success) {
    return next(
      new CustomError(
        "zod",
        "user ID undefined when decrypting JWT",
        403,
        undefined
      )
    );
  }

  try {
    user = await prisma.user.findUnique({
      where: {
        id: decrypt.data.id,
      },
      select: {
        id: true,
        displayName: true,
        firstname: true,
        lastname: true,
        photo: true,
        email: true,
      },
    });
  } catch (err) {
    return next(
      new CustomError("prisma", "Unknown prisma error", 500, undefined)
    );
  }

  if (!user) {
    res.status(404).send({
      detail: "user does not exist",
    });
    return;
  }

  res.send(user);
  return;
});

export { router };
