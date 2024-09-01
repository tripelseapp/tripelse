import { ZodIssueCode } from "zod";
import { ErrorValidating } from "./types";

export const getZodErrors = (
  errors: ErrorValidating[],
  input: string,
): {
  code: ZodIssueCode | undefined;
  message: string | undefined;
} => {
  const err = errors.find((error) => error.for === input)?.message[0];
  return {
    code: err?.code,
    message: err?.message,
  };
};
