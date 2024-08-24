"use client";

import { Button, Input, PasswordInput } from "pol-ui";
import type { FormEvent } from "react";
import { useState } from "react";
import createUser, { PossibleResponsesEnum } from "./action";

type HandleSubmitType = (e: FormEvent<HTMLFormElement>) => Promise<void>;
export default function RegisterPage(): JSX.Element {
  //
  const [errors, setErrors] = useState<
    {
      for: string;
      message: string | undefined | string[];
    }[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const handleSubmit: HandleSubmitType = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const response = await createUser(formData);
      if (response.status === PossibleResponsesEnum.FieldError) {
        setErrors([
          { for: "email", message: response.errors.email },
          { for: "username", message: response.errors.username },
          { for: "password", message: response.errors.password },
        ]);
      }
      if (response.status === PossibleResponsesEnum.GeneralError) {
        setGlobalError(response.generalError);
      }
    } catch (error) {
      setGlobalError("An error occurred. Please try again later.");
    }
    setIsLoading(false);
  };

  return (
    <div className="mt-20 flex min-h-screen w-full flex-col items-center p-10">
      <section className="flex w-full flex-col md:max-w-lg">
        <header className="w-full pb-4">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Register
          </h2>
          {globalError ? (
            <div className="text-sm font-medium text-red-500">
              {globalError}
            </div>
          ) : null}
        </header>

        <form className="flex flex-col gap-10" onSubmit={handleSubmit}>
          <div>
            <Input
              id="username"
              label="Username"
              name="username"
              placeholder="Pep Sanchis"
              required
            />
            <div className="mt-1 text-xs text-red-500">
              {errors.find((error) => error.for === "username")?.message}
            </div>
          </div>
          <div>
            <Input
              id="email"
              label="email"
              name="email"
              placeholder="pepsanchis@email.com"
              required
            />
            <div className="mt-1 text-xs text-red-500">
              {errors.find((error) => error.for === "email")?.message}
            </div>
          </div>
          <div>
            <PasswordInput
              id="password"
              label="Password"
              name="password"
              placeholder="········"
              required
            />
            <div className="mt-1 text-xs text-red-500">
              {errors.find((error) => error.for === "password")?.message}
            </div>
          </div>

          <div className="text-end">
            <Button disabled={isLoading} type="submit">
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
        <p className="mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <a className="text-blue-500" href="/auth/login">
            Create
          </a>
        </p>
      </section>
    </div>
  );
}
