export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiration: process.env.JWT_EXPIRE,
  accessTokenCookieName: process.env.ACCESS_TOKEN_COOKIE_NAME,
};
