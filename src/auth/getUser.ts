"use server";
import { LoginUser } from "src/types";
import { auth } from "./auth";
import { redirect } from "next/navigation";

type Role = "" | "researcher" | "supervisor" | "approver" | "storage" | "admin";
type Roles = Role[];

/**
 * Get the user info from the session.
 * If the user is not logged in, redirect to the login page.
 * If the user is not authorized, throw an error.
 * @param roles Use array to list all roles allowed.
 *              [""] => anyone who has logged in is allowed.
 * @returns The user info.
 * @throws Error if the user is not authorized.
 */
async function getUser(roles: Roles) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user as LoginUser;
  console.log("Login user: ", user);
  console.log("Allowed users:", roles[0] == "" ? "anyone" : roles);

  if (!roles.includes(user.role as Role) && roles[0] !== "") throw Error;
  return user;
}

export default getUser;
