declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      GOOGLE_CALLBACK_URL: string;

      ACCESS_TOKEN_SECRET: string;
      REFRESH_TOKEN_SECRET: string;

      SERVER_URL: string;
      CLIENT_URL: string;
    }
  }
}
export {};
