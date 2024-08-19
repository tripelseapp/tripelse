"use client";
import { CLIENT_API_URL } from "constants/api";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Input, toast } from "pol-ui";
import { FormEvent, useCallback, useState } from "react";
import { z } from "zod";

const IdentificationStep = ({
  onSubmit,
}: {
  onSubmit: (value: string) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<any[]>([]);

  const [usernameOrEmail, setUsernameOrEmail] = useState("");

  // const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
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
        return setErrors(result.error.errors);
      }
    } catch (error: any) {
      return setErrors([{ for: "usernameOrEmail", message: error.errors }]);
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
            pathname + "?" + createQueryString("user", response.username),
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
          label="Username or Email"
          name="usernameOrEmail"
          disabled={isLoading}
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
          id="usernameOrEmail"
          placeholder="Pep Sanchis"
          autoComplete="off"
          required
        />
        <div className="mt-1 text-xs text-red-500">
          {/* {errors.find((error) => error.for === "name")?.message} */}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2">
        <p className="mt-4 text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-blue-500">
            Register
          </a>
        </p>
        <Button loading={isLoading} type="submit" className="w-full">
          {isLoading ? "Searching user..." : "Continue"}
        </Button>
      </div>
    </form>
  );
};

export default IdentificationStep;
