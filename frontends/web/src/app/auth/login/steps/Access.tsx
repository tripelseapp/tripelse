import Link from "next/link";
import { Button, PasswordInput } from "pol-ui";
import { FormEvent, useState } from "react";

interface AccessStepProps {
  goPrevStep: () => void;
  onSubmit: (value: string) => void;
  userName: string;
}

const AccessStep = (props: AccessStepProps) => {
  const { onSubmit, goPrevStep, userName } = props;
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const usernameOrEmail = formData.get("usernameOrEmail") as string;

    //   validate if user exists
    if (false) {
      onSubmit(usernameOrEmail);
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
