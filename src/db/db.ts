import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

const database = drizzle(sql);

export default database;
