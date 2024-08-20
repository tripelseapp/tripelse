"use client";
import { VercelToolbar } from "@vercel/toolbar/next";
// import { useIsEmployee } from "lib/auth"; // Your auth library

export function StaffToolbar() {
  //   const isEmployee = useIsEmployee();
  //   return isEmployee ? <VercelToolbar /> : null;
  return <VercelToolbar />;
}
