"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { Button, PasswordInput } from "pol-ui";
import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import { PossibleResponsesEnum } from "../../register/action";
import login from "../action";

interface AccessStepProps {
  onSubmit: (value: string) => void;
  userName: string;
}

function AccessStep(props: AccessStepProps) {
  const { userName } = props;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const response = await login(formData);
      if (response.status === PossibleResponsesEnum.FieldError) {
        createQueryString("fieldError", JSON.stringify(response.errors));
      }

      if (response.status === PossibleResponsesEnum.GeneralError) {
        router.push(
          `${pathname}?${createQueryString(
            "generalError",
            response.generalError,
          )}`,
        );
      }
    } catch (error) {
      router.push(
        `${pathname}?${createQueryString(
          "generalError",
          "An error occurred. Please try again later.",
        )}`,
      );
    }
    setIsLoading(false);
  };
  return (
    <form
      className="grid h-full w-full grid-rows-[1fr,auto]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-6">
        <header>
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Welcome back, {userName}
          </h2>
          <h3>Please enter your password to continue to your account</h3>
        </header>
        <PasswordInput
          autoComplete="off"
          id="password"
          label="Password"
          name="password"
          placeholder="********"
          required
        />
        <div className="mt-1 text-xs text-red-500">
          {/* {errors.find((error) => error.for === "name")?.message} */}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <p className="mt-4 text-sm text-gray-500">
          That wasn't you?{" "}
          <Button
            onClick={() => {
              router.push(`${pathname}?${createQueryString("user", "")}`);
            }}
            type="button"
            variant="ghost"
          >
            Go back
          </Button>
        </p>
        <Button className="w-full" disabled={isLoading} type="submit">
          {isLoading ? "Searching user..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}

export default AccessStep;
