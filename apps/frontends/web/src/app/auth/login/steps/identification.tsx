"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Input, toast } from "pol-ui";
import type { FormEvent } from "react";
import { useCallback, useState } from "react";
import { z } from "zod";
import { CLIENT_API_URL } from "~/constants/api";

function IdentificationStep({
  onSubmit,
}: {
  onSubmit: (value: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<any[]>([]);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  const identificationSchema = z.object({
    usernameOrEmail: z.string().min(4),
  });
  const validateData = (usernameOrEmail: string) =>
    identificationSchema.safeParse({
      usernameOrEmail,
    });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const usernameOrEmail = formData.get("usernameOrEmail") as string;

    //  validate schema
    try {
      const result = validateData(usernameOrEmail);
      if (!result.success) {
        setErrors(result.error.errors);
        return;
      }
    } catch (error: any) {
      setErrors([{ for: "usernameOrEmail", message: error.errors }]);
      return;
    }

    //   validate if user exists

    const promise = fetch(
      `${CLIENT_API_URL}/api/v1/user/by-email-or-username/${usernameOrEmail}`,
    );

    toast.promise(promise, {
      loading: "Searching user...",
      error: "User not found",
      success() {
        return `User found `;
      },
    });

    await promise
      .then((response) => response.json())
      .then((response) => {
        if (response?.username) {
          onSubmit(response.username);
          router.push(
            `${pathname}?${createQueryString("user", response.username)}`,
          );
        }
      })
      .catch((error) => {
        console.error("error", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form
      className="grid h-full w-full grid-rows-[1fr,auto]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-6">
        <Input
          autoComplete="off"
          disabled={isLoading}
          id="usernameOrEmail"
          label="Username or Email"
          name="usernameOrEmail"
          onChange={(e) => {
            setUsernameOrEmail(e.target.value);
          }}
          placeholder="Pep Sanchis"
          required
          value={usernameOrEmail}
        />
        <div className="mt-1 text-xs text-red-500">
          {errors.find((error) => error.for === "usernameOrEmail")?.message}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <p className="mt-4 text-sm text-gray-500">
          Don't have an account?{" "}
          <a className="text-blue-500" href="/auth/register">
            Register
          </a>
        </p>
        <Button className="w-full" loading={isLoading} type="submit">
          {isLoading ? "Searching user..." : "Continue"}
        </Button>
      </div>
    </form>
  );
}

export default IdentificationStep;
