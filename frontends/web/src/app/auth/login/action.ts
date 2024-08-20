"use server";

import { SERVER_API_URL } from "constants/api";
import { redirect } from "next/navigation";
import { paths } from "public/data/api";
import { z } from "zod";

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
  SUCCESS = "SUCCESS",
  GENERAL_ERROR = "generalError",
  FIELD_ERROR = "fieldError",
}

// Type alias for possible response status strings.
type PossibleResponses = `${PossibleResponsesEnum}`;

// Base response structure shared by all responses.
interface BaseResponse {
  status: PossibleResponses;
}

// Response type for a successful operation.
interface ResponseOk extends BaseResponse, ResponseTokens {
  status: PossibleResponsesEnum.SUCCESS;
}

// Response type for general errors with key-value error details.
interface GeneralError extends BaseResponse {
  status: PossibleResponsesEnum.GENERAL_ERROR;
  generalError: string;
}

// Field-specific errors represented as an array of strings.
type FieldError = string[] | undefined;

// Response type for field errors with possible error messages for specific fields.
interface FieldsErrors extends BaseResponse {
  status: PossibleResponsesEnum.FIELD_ERROR;
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
      status: PossibleResponsesEnum.FIELD_ERROR,
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
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const response = await promise;
  if (response.ok) {
    const data = (await response.json()) as ResponseOk;
    if (data?.accessToken) {
      redirect("/dashboard");
    }
    return data;
  } else {
    const error = (await response.json()) as GeneralError;
    return {
      status: PossibleResponsesEnum.GENERAL_ERROR,
      generalError: error.toString(),
    };
  }
}
