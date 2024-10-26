"use server";

import { signIn } from "@/auth/auth";

type FormData = {
  username: string;
  password: string;
};

export const handleCredentialsLogin = async (values: FormData, callbackUrl: string) => {
  const result = await signIn("credentials", {
    ...values,
    redirect: false,
    callbackUrl,
    redirectTo: "/",
  });
  return result;
};
