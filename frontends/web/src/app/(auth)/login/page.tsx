"use client";

import { paths } from "public/data/api";
import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { API_URL } from "constants/api";

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

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

      const endpoint = `${API_URL}/api/v1/auth/login/credentials`;
      const method = "post";
      const res = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      console.log(res);
      if (res.ok) {
        const data = await res.json();
        if (false) {
          router.push("/dashboard");
        }
        console.log(data);
      } else {
        const error = await res.json();
        console.error;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    setErrors([]);
  };

  return (
    <section className="mt-20 flex min-h-screen w-full flex-col items-center p-10">
      <h2 className="text-2xl font-semibold text-black dark:text-white">
        Login
      </h2>
      <form className="flex flex-col gap-10" method="post" onSubmit={onSubmit}>
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="usernameOrEmail"
            id="usernameOrEmail"
            placeholder="Name"
            value={usernameOrEmail}
            className="active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded-lg border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition focus:border-blue-500 disabled:cursor-default dark:text-white"
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            autoComplete="off"
            required
          />
          <div className="mt-1 text-xs text-red-500">
            {errors.find((error) => error.for === "name")?.message}
          </div>
        </div>
        <div>
          <label className="mb-3 block text-sm font-medium text-black dark:text-white">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="password"
            value={password}
            className="active:border-primary disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary w-full rounded-lg border-[1.5px] bg-transparent px-5 py-3 text-black outline-none transition focus:border-blue-500 disabled:cursor-default dark:text-white"
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            required
          />
          <div className="mt-1 text-xs text-red-500">
            {errors.find((error) => error.for === "email")?.message}
          </div>
        </div>

        <div className="text-end">
          <button
            type="submit"
            className="h-10 w-32 rounded-md bg-blue-600 font-medium text-white disabled:cursor-not-allowed disabled:opacity-30"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </section>
  );
}
