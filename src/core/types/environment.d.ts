import { Secret } from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: Secret | string;
      EMAIL_USER: string;
      EMAIL_PASSWORD: string;
    }
  }
}

export {};
