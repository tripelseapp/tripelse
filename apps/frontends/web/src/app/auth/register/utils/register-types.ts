import type { paths } from "public/data/api";
export const registerEndpoint = "/api/v1/auth/register";

type ResponseTokens =
	paths[typeof registerEndpoint]["post"]["responses"]["201"]["content"]["application/json"];

  	export type RegisterParams =
				paths[typeof registerEndpoint]["post"]["requestBody"]["content"]["application/json"];

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
export type RegisterFieldError = string[] | undefined;

// Response type for field errors with possible error messages for specific fields.
export interface RegisterFieldsErrors extends BaseResponse {
	status: PossibleResponsesEnum.FieldError;
	errors: {
		email?: RegisterFieldError;
		username?: RegisterFieldError;
		password?: RegisterFieldError;
	};
}

// Union type representing all possible responses.
export type RegisterResponse = ResponseOk | GeneralError | RegisterFieldsErrors;
