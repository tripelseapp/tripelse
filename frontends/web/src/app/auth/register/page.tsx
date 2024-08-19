"use client";

import { CLIENT_API_URL } from "constants/api";
import { useRouter } from "next/navigation";
import { Button, Input, PasswordInput, toast } from "pol-ui";
import { paths } from "public/data/api";
import { FormEvent, useState } from "react";
import { z } from "zod";

export default function RegisterPage() {
  //
  const [errors, setErrors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setGlobalError(null);

    const form = e.currentTarget as HTMLFormElement;

    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const mySchema = z.object({
        username: z
          .string()
          .min(4, "Username must be at least 4 characters long"),
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

      // store validation response
      const response = mySchema.safeParse({
        email: email,
        username: username,
        password: password,
      });

      // refine errors
      if (!response.success) {
        let errArr: any[] = [];
        const { errors: err } = response.error;
        for (var i = 0; i < err.length; i++) {
          errArr.push({ for: err[i]?.path[0], message: err[i]?.message });
        }
        setErrors(errArr);
        throw err;
      } else {
        setErrors([]);
      }

      if (errors.length > 0) {
        return;
      }

      const endpoint = "/api/v1/auth/register";

      // handle the login call
      type EndpointParams =
        paths[typeof endpoint]["post"]["requestBody"]["content"]["application/json"];

      const body: EndpointParams = {
        email,
        username,
        password,
      };

      const url = `${CLIENT_API_URL}${endpoint}`;
      const method = "post";

      const promise = fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      toast.promise(promise, {
        loading: "Loading...",
        success: () => {
          return `Welcome to Tripelse!`;
        },
        error: "Login failed",
      });

      const res = await promise;

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        if (data?.accessToken) {
          router.push("/dashboard");
        }
        setGlobalError(null);

        //
      } else {
        const error = await res.json();
        setGlobalError(error.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-20 flex min-h-screen w-full flex-col items-center p-10">
      <section className="flex w-full flex-col md:max-w-lg">
        <header className="w-full pb-4">
          <h2 className="text-2xl font-semibold text-black dark:text-white">
            Register
          </h2>
          {globalError && (
            <div className="text-sm font-medium text-red-500">
              {globalError}
            </div>
          )}
        </header>

        <form className="flex flex-col gap-10" onSubmit={onSubmit}>
          <div>
            <Input
              label="Username"
              name="username"
              id="username"
              placeholder="Pep Sanchis"
              required
            />
            <div className="mt-1 text-xs text-red-500">
              {errors.find((error) => error.for === "username")?.message}
            </div>
          </div>
          <div>
            <Input
              label="email"
              name="email"
              id="email"
              placeholder="pepsanchis@email.com"
              required
            />
            <div className="mt-1 text-xs text-red-500">
              {errors.find((error) => error.for === "email")?.message}
            </div>
          </div>
          <div>
            <PasswordInput
              label="Password"
              placeholder="········"
              name="password"
              id="password"
              required
            />
            <div className="mt-1 text-xs text-red-500">
              {errors.find((error) => error.for === "password")?.message}
            </div>
          </div>

          <div className="text-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
        <p className="mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-500">
            Create
          </a>
        </p>
      </section>
    </div>
  );
}
