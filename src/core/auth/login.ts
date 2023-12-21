import express from "express";

import { verifyArray } from "../verifyArray/verifyArray";
import { AuthError } from "../errors/auth";
import { pool } from "../database/prisma";
import { verifyPasswordHash } from "../argon2/argon2";
import { createToken } from "../jwt/jwt";
import { generalScopes } from "../data/scopes";

const login = express.Router();

login.post("/", async (req, res) => {
   const { username, password } = req.body;

   const didPassCheck = verifyArray({ username, password });

   if (!didPassCheck.succeded) {
      return res
         .status(
            AuthError.didNotProideItems(didPassCheck.itemsMissing).details
               .errorCode,
         )
         .send(AuthError.didNotProideItems(didPassCheck.itemsMissing).details);
   }

   let prismaRes;

   try {
      prismaRes = await pool.user.findUnique({
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

   if (prismaRes === null) {
      return res
         .status(AuthError.youDoNotExist().details.errorCode)
         .send(AuthError.youDoNotExist().details);
   }

   if (!prismaRes.verified) {
      return res
         .status(AuthError.notVerified().details.errorCode)
         .send(AuthError.notVerified().details);
   }

   if (!(await verifyPasswordHash(prismaRes.password, password))) {
      return res
         .status(AuthError.incorrectPassword().details.errorCode)
         .send(AuthError.incorrectPassword().details);
   }

   const accessToken = createToken(prismaRes.id, generalScopes);

   return res.send({
      accessToken,
   });
});

export { login };
