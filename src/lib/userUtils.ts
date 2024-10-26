"use server";

import { auth } from "@/auth/auth";
import { LoginUser } from "src/types";

export const getSignedUser = async () => {
  const session = await auth();
  if (!session?.user) return;
  return session.user as LoginUser;
};
