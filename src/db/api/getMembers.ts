import database from "@/db/db";
import { membersTable } from "../schema";

const getMembers = async () => {
  const members = await database.select().from(membersTable);
  return members;
};

export default getMembers;
