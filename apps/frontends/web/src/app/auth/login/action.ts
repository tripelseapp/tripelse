"use server";

import { redirect } from "next/navigation";
import type { paths } from "public/data/api";
import { z } from "zod";
import { SERVER_API_URL } from "~/constants/api";

const registerSchema = z.object({
  usernameOrEmail: z.string().min(3),
  email: z.string().min(5),
});
const endpoint = "/api/v1/auth/login/credentials";
const url = `${SERVER_API_URL}${endpoint}`;
const method = "post";
//
type RegisterParams =
  paths[typeof endpoint]["post"]["requestBody"]["content"]["application/json"];
//
type ResponseTokens =
  paths[typeof endpoint]["post"]["responses"]["201"]["content"]["application/json"];
// Enum representing the possible response statuses.
enum PossibleResponsesEnum {
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
    usernameOrEmail?: FieldError;
    password?: FieldError;
  };
}

// Union type representing all possible responses.
type Response = ResponseOk | GeneralError | FieldsErrors;

//
export default async function login(formData: FormData): Promise<Response> {
  const usernameOrEmail = formData.get("usernameOrEmail") as string;
  const password = formData.get("password") as string;
  const validatedFields = registerSchema.safeParse({
    usernameOrEmail,
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

  const body: RegisterParams = {
    password,
    usernameOrEmail,
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
    const data = (await response.json()) as ResponseOk;
    if (data.accessToken) {
      redirect("/dashboard");
    }
    return data;
  }
  const error = (await response.json()) as GeneralError;
  return {
    status: PossibleResponsesEnum.GeneralError,
    generalError: error.toString(),
  };
}
