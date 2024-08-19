"use client";

import { redirect } from "next/navigation";
import { useState } from "react";
import AccessStep from "./steps/Access";
import IdentificationStep from "./steps/Identification";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  //
  // const [errors, setErrors] = useState<any[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   const formData = new FormData(e.currentTarget);
  //   try {
  //     const response = await login(formData);
  //     if (response.status === "fieldError") {
  //       setErrors([
  //         { for: "usernameOrEmail", message: response.errors.usernameOrEmail },
  //         { for: "password", message: response.errors.password },
  //       ]);
  //     }
  //     if (response.status === "generalError") {
  //       setGlobalError(response.generalError);
  //     }
  //   } catch (error) {
  //     setGlobalError("An error occurred. Please try again later.");
  //   }
  //   setIsLoading(false);
  // };
  // const [step, { goToNextStep, goToPrevStep }] = useStep(2);

  const hasUser = searchParams.user;

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <pre>
        {JSON.stringify(
          {
            searchParams,
          },
          null,
          2,
        )}
      </pre>
      <header className="h-fit w-full pb-4">
        {globalError && (
          <div className="text-sm font-medium text-red-500">{globalError}</div>
        )}
      </header>

      {!hasUser ? (
        <IdentificationStep
          onSubmit={(value) => {
            console.log(value);
          }}
        />
      ) : (
        <AccessStep
          userName={searchParams.user as string}
          onSubmit={() => {}}
          goPrevStep={() => redirect("/auth/login")}
        />
      )}
    </div>
  );
}
