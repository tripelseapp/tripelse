import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;

export async function verifyToken(token: string) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    // Verify and decode the token
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET),
    );
    return payload;
  } catch (error) {
    // Handle token verification errors
    console.error("Invalid token:", error);
    return null;
  }
}
