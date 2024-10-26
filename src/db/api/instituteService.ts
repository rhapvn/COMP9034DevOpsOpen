import database from "@/db/db";
import { DatabaseError } from "@/lib/DatabaseError";
import { institutesTable } from "../schema";
import { and, desc, eq } from "drizzle-orm";
import { ThrowableError } from "@/lib/ThrowableError";
import { DTOResponse, Institute } from "src/types";
import { revalidateTag } from "next/cache";

export const addInstitute = async (instituteData: Partial<Institute>) => {
  let res: DTOResponse<{ id: number }> = {
    success: false,
    data: { id: -1 },
    message: "",
  };
  try {
    if (!instituteData.name) throw new ThrowableError("Please provide the institute name.");

    const data = {
      name: instituteData.name,
      address: instituteData.address,
    };
    const insertedResult = await database.insert(institutesTable).values(data).returning({ id: institutesTable.id });

    if (!insertedResult || insertedResult.length == 0) {
      throw new DatabaseError("Failed to add this institute details because database query error. Please try again.");
    }

    res.success = true;
    res.data = { id: insertedResult[0].id };
    revalidateTag("placeUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const updateInstitute = async (instituteData: Partial<Institute>) => {
  let res: DTOResponse<number> = {
    success: false,
    data: -1,
    message: "",
  };
  try {
    if (!instituteData.id) throw new ThrowableError("Please provide the institute id.");
    if (!instituteData.name) throw new ThrowableError("Please provide the institute name.");
    const updatedResult: { updatedId: number }[] = await database
      .update(institutesTable)
      .set({
        name: instituteData.name,
        address: instituteData.address,
      })
      .where(eq(institutesTable.id, instituteData.id))
      .returning({ updatedId: institutesTable.id });

    if (!updatedResult || updatedResult.length == 0) {
      throw new DatabaseError(
        "Failed to update this institute details because database query error. Please try again.",
      );
    }

    res.success = true;
    res.data = updatedResult[0].updatedId;
    revalidateTag("placeUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const removeInstitute = async (id: number) => {
  let res: DTOResponse<number> = {
    success: false,
    data: -1,
    message: "",
  };
  try {
    if (!id) throw new ThrowableError("Please provide the institute id.");
    const result: { updatedId: number }[] = await database
      .update(institutesTable)
      .set({
        isDeleted: true,
      })
      .where(eq(institutesTable.id, id))
      .returning({ updatedId: institutesTable.id });

    if (!result || result.length == 0) {
      throw new DatabaseError("Failed to remove this institute because database query error. Please try again.");
    }

    res.success = true;
    res.data = result[0].updatedId;
    revalidateTag("placeUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const getInstitutes = async () => {
  let res: DTOResponse<Array<Institute>> = {
    success: false,
    data: [],
    message: "",
  };
  try {
    const institutes = await database
      .select()
      .from(institutesTable)
      .where(eq(institutesTable.isDeleted, false))
      .orderBy(desc(institutesTable.id));

    if (!institutes) {
      throw new DatabaseError("Unable to access institute database because database query error. Please try again.");
    }
    if (institutes?.length == 0) {
      throw new DatabaseError("No data found.");
    }

    res.success = true;
    res.data = institutes;
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const getInstituteById = async (id: number) => {
  let res: DTOResponse<Institute | null> = {
    success: false,
    data: null,
    message: "",
  };
  try {
    if (!id) throw new ThrowableError("Please provide the institute id.");
    const institute = await database
      .select()
      .from(institutesTable)
      .where(and(eq(institutesTable.id, id), eq(institutesTable.isDeleted, false)));

    if (!institute) {
      throw new DatabaseError(
        "Failed to access this institute details because database query error. Please try again.",
      );
    }
    if (institute?.length == 0) {
      throw new DatabaseError("No data found.");
    }

    res.success = true;
    res.data = institute[0];
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};
