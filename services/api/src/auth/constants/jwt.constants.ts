export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiration: process.env.JWT_EXPIRE,
  accessTokenCookieName: process.env.ACCESS_TOKEN_COOKIE_NAME,
  refreshExpire: process.env.JWT_REFRESH_EXPIRATION,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
};
