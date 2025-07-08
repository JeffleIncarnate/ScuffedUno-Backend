import express from "express";
import { google } from "googleapis";

import { SCOPES } from "../../core/data/scopes";

const router = express.Router();

router.get("/", (req, res) => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
  );

  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: SCOPES,
  });

  res.redirect(url);
});

export { router };
