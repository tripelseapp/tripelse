"use client";

import { CLIENT_API_URL } from "constants/api";
import { useRouter } from "next/navigation";
import { Button, Input, PasswordInput, toast } from "pol-ui";
import { paths } from "public/data/api";
import { useState } from "react";
import { z } from "zod";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [globalError, setGlobalError] = useState<string | null>(null);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const mySchema = z.object({
        usernameOrEmail: z.string().min(3),
        email: z.coerce.string().min(5),
      });

      // store validation response
      const response = mySchema.safeParse({
        usernameOrEmail: usernameOrEmail,
        email: password,
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

      // handle the login call
      type EndpointParams =
        paths["/api/v1/auth/login/credentials"]["post"]["requestBody"]["content"]["application/json"];

      const body: EndpointParams = {
        usernameOrEmail,
        password,
      };

      console.log(body);

      const endpoint = `${CLIENT_API_URL}/api/v1/auth/login/credentials`;
      const method = "post";

      const promise = fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      toast.promise(promise, {
        loading: "Loading...",
        success: "Login successful",
        error: "Login failed",
      });

      const res = await promise;

      console.log(res);
      if (res.ok) {
        const data = await res.json();
        if (false) {
          router.push("/dashboard");
        }
        console.log(data);
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
            Login
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
              label="Username or Email"
              name="usernameOrEmail"
              id="usernameOrEmail"
              placeholder="Name"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              autoComplete="off"
              required
            />
            <div className="mt-1 text-xs text-red-500">
              {errors.find((error) => error.for === "name")?.message}
            </div>
          </div>
          <div>
            <PasswordInput
              label="Password"
              placeholder="Password"
              name="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              required
            />
            <div className="mt-1 text-xs text-red-500">
              {errors.find((error) => error.for === "email")?.message}
            </div>
          </div>

          <div className="text-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>

        <p className="mt-4 text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-blue-500">
            Register
          </a>
        </p>
      </section>
    </div>
  );
}
