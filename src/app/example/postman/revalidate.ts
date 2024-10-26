"use server";

import { revalidateTag } from "next/cache";

export async function revalidateAllRequests() {
  revalidateTag("allRequests");
  return { message: "Revalidated allRequests tag" };
}
