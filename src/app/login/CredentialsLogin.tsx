"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { handleCredentialsLogin } from "./handleCredentialsLogin";

type FormData = {
  username: string;
  password: string;
};

const ID_PASS = [
  { idPass: "re/re", role: "Research staff" },
  { idPass: "su/su", role: "Supervisor" },
  { idPass: "ap/ap", role: "Higher Approver" },
  { idPass: "st/st", role: "Storage" },
  { idPass: "ad/ad", role: "Administrator" },
];

export const CredentialsLogin = () => {
  const router = useRouter();
  const callbackUrl = "/";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      try {
        await handleCredentialsLogin(values, callbackUrl);
        router.push("/");
      } catch {
        setError("Check Username and password ");
        console.log("Login error: credentialsLogin()");
      }
    });
  };

  return (
    <div className=" absolute left-80 top-[-400px] rounded-lg bg-white p-6 shadow-md w-80">
      <h2 className="mb-4 text-center text-2xl font-semibold">Only for Dev</h2>

      <div>ID/Pass:</div>
      {ID_PASS.map((idPass) => (
        <div key={idPass.idPass} className="flex pl-4">
          <p className="w-12">{idPass.idPass}</p>
          <p>{idPass.role}</p>
        </div>
      ))}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              {...register("username", { required: "Username is required" })}
              disabled={isPending}
              placeholder="username"
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.username && <span className="text-sm text-red-500">{errors.username.message}</span>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              {...register("password", { required: "Password is required" })}
              disabled={isPending}
              placeholder="******"
              type="password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />

            {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
          </div>
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        {success && <div className="text-sm text-green-500">{success}</div>}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-md bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
        >
          {showTwoFactor ? "Confirm" : "Login"}
        </button>
      </form>
    </div>
  );
};
