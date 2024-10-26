import database from "@/db/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

const getUserByUsername = cache(async (username: string) => {
  const user = await database.select().from(usersTable).where(eq(usersTable.username, username)).execute();
  return user.length > 0 ? user[0] : null;
});

export default getUserByUsername;
