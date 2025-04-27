"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { SERVER_API_URL } from "~/constants/api";
import {
	PossibleResponsesEnum,
	type RegisterFieldsErrors,
	type RegisterParams,
	type RegisterResponse,
	registerEndpoint,
} from "./register-types";

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
const url = `${SERVER_API_URL}${registerEndpoint}`;
const method = "post";

export async function createUser(
	formData: FormData,
): Promise<RegisterResponse> {
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
		const res: RegisterFieldsErrors = {
			status: PossibleResponsesEnum.FieldError,
			errors: validatedFields.error.flatten().fieldErrors,
		};
		return res;
	}

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
