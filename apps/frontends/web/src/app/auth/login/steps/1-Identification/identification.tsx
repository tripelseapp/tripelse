"use client";
import { Button, Input } from "pol-ui";
import { useIdentification } from "./use-identification";

function IdentificationStep() {
  const { isLoading, errorMessage, handleSubmit, userOrMail } =
    useIdentification();

  return (
    <form
      className="grid h-full w-full grid-rows-[1fr,auto] pt-10"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-4">
        <Input
          disabled={isLoading}
          color={Boolean(errorMessage) ? "error" : "primary"}
          id={userOrMail.name}
          label={userOrMail.labelKey}
          name={userOrMail.name}
          minLength={userOrMail.validations.minLength}
          {...userOrMail.validations}
        />

        {/* Errors */}
        <div className="mt-1 text-xs text-red-500">{errorMessage}</div>

        {/*  */}

        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <a className="text-blue-500" href="/auth/register">
            Register
          </a>
        </p>
      </div>

      {/*  */}
      <footer className="flex w-full flex-col gap-2">
        <Button className="w-full" loading={isLoading} type="submit">
          {isLoading ? "Searching user..." : "Continue"}
        </Button>
      </footer>
    </form>
  );
}

export default IdentificationStep;
