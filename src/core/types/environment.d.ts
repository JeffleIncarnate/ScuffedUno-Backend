import { Secret } from "jsonwebtoken";
import { IScopes } from "../data/scopes";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: Secret | string;
      EMAIL_USER: string;
      EMAIL_PASSWORD: string;
    }
  }

  namespace Express {
    export interface Request {
      uuid: string;
      scopes: IScopes;
    }
  }
}

export {};
