import database from "@/db/db";
import {
  institutesTable,
  laboratoriesTable,
  placeTagEnum,
  researchCentresTable,
  userRoleEnum,
  usersTable,
} from "../schema";
import { eq, sql, desc } from "drizzle-orm";
import { DatabaseError } from "@/lib/DatabaseError";
import { ThrowableError } from "@/lib/ThrowableError";
import { getSignedUser } from "@/lib/userUtils";
import { DTOResponse, User, userStatusType } from "src/types";
import { revalidateTag } from "next/cache";

export const getUsers = async () => {
  let res: DTOResponse<Array<User>> = {
    success: false,
    data: [],
    message: "",
  };
  try {
    const users = await database
      .select({
        userId: usersTable.userId,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        phone: usersTable.phone,
        email: usersTable.email,
        role: usersTable.role,
        status: usersTable.status,
        profileImg: usersTable.profileImg,
        createdBy: usersTable.createdBy,
        createdTime: usersTable.createdTime,
        placeTag: usersTable.placeTag,
        placeTagId: usersTable.placeTagId,
        placeTagName: sql`COALESCE(${institutesTable.name}, ${researchCentresTable.name}, ${laboratoriesTable.name})`,
      })
      .from(usersTable)
      .leftJoin(
        institutesTable,
        sql`${usersTable.placeTag} = 'institute' AND ${usersTable.placeTagId} = ${institutesTable.id}`,
      )
      .leftJoin(
        researchCentresTable,
        sql`${usersTable.placeTag} = 'researchCentre' AND ${usersTable.placeTagId} = ${researchCentresTable.id}`,
      )
      .leftJoin(
        laboratoriesTable,
        sql`${usersTable.placeTag} = 'laboratory' AND ${usersTable.placeTagId} = ${laboratoriesTable.id}`,
      )
      .orderBy(desc(usersTable.createdTime))
      .execute();

    if (!users) {
      throw new DatabaseError("Something went wrong with the database access. Please try again.");
    }
    if (users.length == 0) {
      throw new DatabaseError("No data found.");
    }

    res.success = true;
    res.data = users as User[];
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const getUserById = async (userId: number) => {
  let res: DTOResponse<User | null> = {
    success: false,
    data: null,
    message: "",
  };
  try {
    if (!userId) throw new ThrowableError("Please provide user id in order to get the user details.");

    const user = await database
      .select({
        userId: usersTable.userId,
        firstName: usersTable.firstName,
        lastName: usersTable.lastName,
        phone: usersTable.phone,
        email: usersTable.email,
        role: usersTable.role,
        status: usersTable.status,
        profileImg: usersTable.profileImg,
        createdBy: usersTable.createdBy,
        createdTime: usersTable.createdTime,
        placeTag: usersTable.placeTag,
        placeTagId: usersTable.placeTagId,
        placeTagName: sql`COALESCE(${institutesTable.name}, ${researchCentresTable.name}, ${laboratoriesTable.name})`,
      })
      .from(usersTable)
      .leftJoin(
        institutesTable,
        sql`${usersTable.placeTag} = 'institute' AND ${usersTable.placeTagId} = ${institutesTable.id}`,
      )
      .leftJoin(
        researchCentresTable,
        sql`${usersTable.placeTag} = 'researchCentre' AND ${usersTable.placeTagId} = ${researchCentresTable.id}`,
      )
      .leftJoin(
        laboratoriesTable,
        sql`${usersTable.placeTag} = 'laboratory' AND ${usersTable.placeTagId} = ${laboratoriesTable.id}`,
      )
      .where(eq(usersTable.userId, userId));

    if (!user) {
      throw new DatabaseError("Something went wrong with database access. Please try again.");
    }
    if (user.length <= 0) {
      throw new DatabaseError("No user found.");
    }
    res.success = true;
    res.data = user[0] as User;
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const addUser = async (userData: Partial<User>) => {
  let res: DTOResponse<{ id: number }> = {
    success: false,
    data: { id: 0 },
    message: "",
  };
  try {
    const signedUser = await getSignedUser();
    if (!signedUser) throw new ThrowableError("Please sign in to the system and then try again.");

    const data = {
      firstName: userData.firstName || "",
      lastName: userData.lastName,
      phone: userData.phone || "",
      email: userData.email || "",
      role: userData.role || userRoleEnum.enumValues[1],
      createdBy: parseInt(signedUser.id),
      placeTag: userData.placeTag || placeTagEnum.enumValues[0],
      placeTagId: userData.placeTagId || 0,
      username: userData.firstName || "",
      password: userData.firstName || "",
    };

    const insertedResult = await database.insert(usersTable).values(data).returning({ userId: usersTable.userId });

    if (!insertedResult || insertedResult.length === 0) {
      throw new DatabaseError("Unable to submit this user details. Please try again.");
    }

    res.success = true;
    res.data = { id: insertedResult[0].userId };
    revalidateTag("userUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const updateUserDetails = async (userDetails: Partial<User>) => {
  let res: DTOResponse<number> = {
    success: false,
    data: -1,
    message: "",
  };
  try {
    const signedUser = await getSignedUser();
    if (!signedUser) throw new ThrowableError("Please log in to the system and then try again.");

    const updateResult: { updatedId: number }[] = await database
      .update(usersTable)
      .set({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phone: userDetails.phone,
        email: userDetails.email,
        role: userDetails.role,
        profileImg: userDetails.profileImg,
        placeTag: userDetails.placeTag,
        placeTagId: userDetails.placeTagId,
        lastUpdateBy: parseInt(signedUser.id),
        lastUpdateTime: sql`NOW()`,
      })
      .where(sql`${usersTable.userId} = ${userDetails.userId}`)
      .returning({ updatedId: usersTable.userId });

    if (!updateResult || updateResult?.length == 0) {
      throw new DatabaseError("Unable to update this user details. Please try again.");
    }

    res.success = true;
    res.data = updateResult[0].updatedId;
    revalidateTag("userUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const updateUserPersonalDetails = async (userDetails: Partial<User>) => {
  let res: DTOResponse<number> = {
    success: false,
    data: -1,
    message: "",
  };
  try {
    const signedUser = await getSignedUser();
    if (!signedUser) throw new ThrowableError("Please log in to the system and then try again.");

    const updatedUser: { updatedId: number }[] = await database
      .update(usersTable)
      .set({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phone: userDetails.phone,
        profileImg: userDetails.profileImg,
        lastUpdateBy: parseInt(signedUser.id),
        lastUpdateTime: sql`NOW()`,
      })
      .where(sql`${usersTable.userId} = ${userDetails.userId}`)
      .returning({ updatedId: usersTable.userId });

    if (!updatedUser || updatedUser?.length == 0)
      throw new DatabaseError("Unable to update your personal details. Please try again.");

    res.success = true;
    res.data = updatedUser[0].updatedId;
    revalidateTag("userUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const updateUserStatus = async (userId: number, newStatus: userStatusType) => {
  let res: DTOResponse<number> = {
    success: false,
    data: -1,
    message: "",
  };
  try {
    const signedUser = await getSignedUser();
    if (!signedUser) throw new ThrowableError("Please log in to the system and then try again.");

    const updatedUserStatus: { updatedId: number }[] = await database
      .update(usersTable)
      .set({
        status: newStatus,
        lastUpdateBy: parseInt(signedUser.id),
        lastUpdateTime: sql`NOW()`,
      })
      .where(eq(usersTable.userId, userId))
      .returning({ updatedId: usersTable.userId });

    if (!updatedUserStatus || updatedUserStatus?.length == 0)
      throw new DatabaseError("Unable to update this user status. Please try again.");

    res.success = true;
    res.data = updatedUserStatus[0].updatedId;
    revalidateTag("userUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
      return res;
    }
    return res;
  }
};
