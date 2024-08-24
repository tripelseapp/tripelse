import type { JWTPayload } from "jose";
import { cookies } from "next/headers";
import { verifyToken } from "./verify-token";

export const getToken = async (): Promise<JWTPayload | null> => {
  const cookieStore = cookies();
  const t = cookieStore.get("tripelse_access_token")?.value;
  if (!t) {
    return null;
  }
  return verifyToken(t);
};
