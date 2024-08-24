const getEnv = (key: string) => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(
      `Configuration error - missing environment variable: ${key}`,
    );
  }

  return value;
};
export default () => ({
  app: {
    name: getEnv('APP_NAME'),
    domain: getEnv('API_DOMAIN'),
  },
  client: {
    domain: getEnv('CLIENT_DOMAIN'),
  },
  api: {
    version: getEnv('API_VERSION'),
    prefix: getEnv('API_PREFIX'),
    port: parseInt(getEnv('API_PORT'), 10),
  },
  email: {
    client: getEnv('GOOGLE_CLIENT_ID'),
    password: getEnv('GOOGLE_APP_PASSWORD'),
    user: getEnv('GOOGLE_MAIL_USER'),
    secret: getEnv('GOOGLE_CLIENT_SECRET'),
    callbackUrl: getEnv('GOOGLE_CALLBACK_URL'),
    host: getEnv('GOOGLE_MAIL_HOST'),
    port: getEnv('GOOGLE_MAIL_PORT'),
  },
  db: {
    host: getEnv('DB_HOST'),
    port: getEnv('DB_PORT'),
    user: getEnv('DB_USER'),
    uri: getEnv('CONNECT_STRING'),
  },
  jwt: {
    secret: getEnv('JWT_SECRET'),
    expiration: getEnv('JWT_EXPIRE'),
    accessTokenCookie: getEnv('ACCESS_TOKEN_COOKIE_NAME'),
    refreshTokenCookie: getEnv('REFRESH_TOKEN_COOKIE_NAME'),
    refreshExpire: getEnv('JWT_REFRESH_EXPIRATION'),
    refreshSecret: getEnv('JWT_REFRESH_SECRET'),
  },
});
