import { ZodIssue } from "zod";

export type ErrorValidating = {
  message: ZodIssue[];
  for: string;
};
