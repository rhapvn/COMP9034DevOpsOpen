import { getUserById } from "@/db/apiRoutes";
import getUser from "@/auth/getUser";
import { User } from "src/types";

export const fetchUserData = async (): Promise<User | null> => {
  try {
    const user = await getUser([""]);
    const id = parseInt(user.id, 10);
    const data = await getUserById(id);

    if (data.success) {
      return data.data;
    } else {
      throw new Error("Failed to fetch user data.");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};