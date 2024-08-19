"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, PasswordInput } from "pol-ui";
import { FormEvent, useCallback, useState } from "react";
import login from "../action";

interface AccessStepProps {
  goPrevStep: () => void;
  onSubmit: (value: string) => void;
  userName: string;
}

const AccessStep = (props: AccessStepProps) => {
  const { onSubmit, goPrevStep, userName } = props;
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
      if (response.status === "fieldError") {
        createQueryString("fieldError", JSON.stringify(response.errors));
      }

      if (response.status === "generalError") {
        router.push(
          pathname +
            "?" +
            createQueryString("generalError", response.generalError),
        );
      }
    } catch (error) {
      router.push(
        pathname +
          "?" +
          createQueryString(
            "generalError",
            "An error occurred. Please try again later.",
          ),
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
          label="Password"
          placeholder="********"
          name="password"
          id="password"
          autoComplete="off"
          required
        />
        <div className="mt-1 text-xs text-red-500">
          {/* {errors.find((error) => error.for === "name")?.message} */}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <p className="mt-4 text-sm text-gray-500">
          That wasn't you?{" "}
          <Link href="/auth/login">
            <Button type="button" variant="ghost">
              Go back
            </Button>
          </Link>
        </p>
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Searching user..." : "Continue"}
        </Button>
      </div>
    </form>
  );
};

export default AccessStep;
