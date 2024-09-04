"use client";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { toast, useBoolean, useNetwork } from "pol-ui";
import { FormEvent, useCallback, useState } from "react";
import { ErrorValidating } from "../../../../../utils/zod-errors/types";
import { CLIENT_API_URL } from "~/constants/api";
import { getZodErrors } from "~/utils/zod-errors/zod-errors";
import { loginConstants } from "../../constants/login-constants";
import { z, ZodError } from "zod";

export const useIdentification = () => {
  const {
    value: isLoading,
    setTrue: startLoading,
    setFalse: endLoading,
  } = useBoolean(false);

  const { identification, params } = loginConstants;
  const userOrMail = identification.userOrEmail;

  const { isOnline } = useNetwork();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [errors, setErrors] = useState<ErrorValidating[]>([]);

  const getThisError = () => {
    return getZodErrors(errors, userOrMail.name);
  };
  const setZodError = (message: z.ZodIssue[]) => {
    setErrors([{ for: userOrMail.name, message }]);
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );
  const identificationSchema = z.object({
    usernameOrEmail: z.string().min(Number(userOrMail.validations.minLength)),
  });
  const validateData = (usernameOrEmail: string) =>
    identificationSchema.safeParse({
      usernameOrEmail,
    });

  //
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const usernameOrEmail = formData.get(userOrMail.name) as string;

    if (!usernameOrEmail) {
      throw new Error("usernameOrEmail is required");
    }

    startLoading();

    // validate if online

    if (!isOnline) {
      endLoading();
      toast.error("Network error", {
        description: "Seems like you are offline, try again",
        action: {
          label: "This is a bug",
          onClick: () => console.log("buggy buggy"),
        },
      });
      return;
    }
    //  validate schema
    console.log("usernameOrEmail", usernameOrEmail);
    try {
      const result = validateData(usernameOrEmail);

      console.log("result", result);
      if (!result.success) {
        endLoading();
        return;
      }
    } catch (error: any) {
      setZodError(error.errors);
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
      .then((r) => r.json())
      .then((response) => {
        if (response?.username) {
          // onSubmit(response.username);

          router.push(
            `${pathname}?${createQueryString(params.user, response.username)}`,
          );
        }
      })
      .catch((error) => {
        console.error("error", error);
      })
      .finally(() => {
        endLoading();
      });
  };

  const errorMessage = getThisError().message;

  return { isLoading, errorMessage, handleSubmit, userOrMail };
};
