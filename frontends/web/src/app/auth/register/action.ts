"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import type { paths } from "public/data/api";
import { SERVER_API_URL } from "~/constants/api";

const registerSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters long"),
  email: z
    .string()
    .email("Invalid email format")
    .min(8, "Email must be at least 8 characters long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/(?=.*\W)/, {
      message: "Password must contain at least one special character",
    }),
});
const endpoint = "/api/v1/auth/register";
const url = `${SERVER_API_URL}${endpoint}`;
const method = "post";
type ResponseTokens =
  paths[typeof endpoint]["post"]["responses"]["201"]["content"]["application/json"];
// Enum representing the possible response statuses.
export enum PossibleResponsesEnum {
  Success = "Success",
  GeneralError = "GeneralError",
  FieldError = "FieldError",
}

// Type alias for possible response status strings.
type PossibleResponses = `${PossibleResponsesEnum}`;

// Base response structure shared by all responses.
interface BaseResponse {
  status: PossibleResponses;
}

// Response type for a successful operation.
interface ResponseOk extends BaseResponse, ResponseTokens {
  status: PossibleResponsesEnum.Success;
}

// Response type for general errors with key-value error details.
interface GeneralError extends BaseResponse {
  status: PossibleResponsesEnum.GeneralError;
  generalError: string;
}

// Field-specific errors represented as an array of strings.
type FieldError = string[] | undefined;

// Response type for field errors with possible error messages for specific fields.
interface FieldsErrors extends BaseResponse {
  status: PossibleResponsesEnum.FieldError;
  errors: {
    email?: FieldError;
    username?: FieldError;
    password?: FieldError;
  };
}

// Union type representing all possible responses.
type Response = ResponseOk | GeneralError | FieldsErrors;

export default async function createUser(
  formData: FormData,
): Promise<Response> {
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const validatedFields = registerSchema.safeParse({
    email,
    username,
    password,
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    const res: FieldsErrors = {
      status: PossibleResponsesEnum.FieldError,
      errors: validatedFields.error.flatten().fieldErrors,
    };
    return res;
  }
  type RegisterParams =
    paths[typeof endpoint]["post"]["requestBody"]["content"]["application/json"];

  const body: RegisterParams = {
    email,
    username,
    password,
  };

  // Create the user
  const promise = fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const response = await promise;
  if (response.ok) {
    const data = await response.json();
    if (data?.accessToken) {
      redirect("/dashboard");
    }
    return data;
  }
  const error = await response.json();
  return {
    status: PossibleResponsesEnum.GeneralError,
    generalError: error,
  };
}
