export const constants = {
  api: {
    version: process.env.API_VERSION,
    prefix: process.env.API_PREFIX,
  },
  cookies: {
    accessToken: process.env.ACCESS_TOKEN_COOKIE_NAME,
    refreshToken: process.env.REFRESH_TOKEN_COOKIE_NAME,
  },
  mail: {
    user: process.env.GOOGLE_MAIL_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
    port: process.env.GOOGLE_MAIL_PORT,
    host: process.env.GOOGLE_MAIL_HOST,
  },
};
