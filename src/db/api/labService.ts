import database from "@/db/db";
import { DatabaseError } from "@/lib/DatabaseError";
import { laboratoriesTable, researchCentresTable } from "../schema";
import { desc, eq, and } from "drizzle-orm";
import { ThrowableError } from "@/lib/ThrowableError";
import { DTOResponse, Laboratory } from "src/types";
import { revalidateTag } from "next/cache";

export const addLab = async (labData: Partial<Laboratory>) => {
  let res: DTOResponse<{ id: number }> = {
    success: false,
    data: { id: -1 },
    message: "",
  };
  try {
    if (!labData.name) throw new ThrowableError("Please provide laboratory name.");
    if (!labData.centreId) throw new ThrowableError("Please provide the research centre id.");

    const data = {
      name: labData.name,
      address: labData.address,
      centreId: labData.centreId,
    };
    const insertedResult = await database
      .insert(laboratoriesTable)
      .values(data)
      .returning({ id: laboratoriesTable.id });

    if (!insertedResult || insertedResult.length == 0) {
      throw new DatabaseError("Unable to add this laboratory details because database query error. Please try again.");
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

export const updateLab = async (labData: Partial<Laboratory>) => {
  let res: DTOResponse<number> = {
    success: false,
    data: -1,
    message: "",
  };
  try {
    if (!labData.id) throw new ThrowableError("Please provide the laboratory id.");
    if (!labData.name) throw new ThrowableError("Please provide the laboratory name.");
    if (!labData.centreId) throw new ThrowableError("Please provide the research centre id.");

    const updatedResult: { updatedId: number }[] = await database
      .update(laboratoriesTable)
      .set({
        name: labData.name,
        address: labData.address,
        centreId: labData.centreId,
      })
      .where(eq(laboratoriesTable.id, labData.id))
      .returning({ updatedId: laboratoriesTable.id });

    if (!updatedResult || updatedResult?.length == 0) {
      throw new DatabaseError(
        "Unable to update this laboratory details because database query error. Please try again.",
      );
    }

    res.success = true;
    res.data = updatedResult[0].updatedId;
    revalidateTag("placeUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const removeLab = async (id: number) => {
  let res: DTOResponse<number> = {
    success: false,
    data: -1,
    message: "",
  };
  try {
    if (!id) throw new ThrowableError("Please provide the laboratory id.");
    const updatedResult: { updatedId: number }[] = await database
      .update(laboratoriesTable)
      .set({
        isDeleted: true,
      })
      .where(eq(laboratoriesTable.id, id))
      .returning({ updatedId: laboratoriesTable.id });

    if (!updatedResult || updatedResult?.length == 0) {
      throw new DatabaseError("Unable to remove this laboratory because database query error. Please try again.");
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

export const getLabs = async () => {
  let res: DTOResponse<Array<Laboratory>> = {
    success: false,
    data: [],
    message: "",
  };
  try {
    const labs = await database
      .select({
        id: laboratoriesTable.id,
        name: laboratoriesTable.name,
        address: laboratoriesTable.address,
        centreId: laboratoriesTable.centreId,
        centreName: researchCentresTable.name,
        isDeleted: laboratoriesTable.isDeleted,
      })
      .from(laboratoriesTable)
      .innerJoin(researchCentresTable, eq(laboratoriesTable.centreId, researchCentresTable.id))
      .where(eq(laboratoriesTable.isDeleted, false))
      .orderBy(desc(laboratoriesTable.id));

    if (!labs) {
      throw new DatabaseError("Unable to access Laboratory database because database query error. Please try again.");
    }
    if (labs.length == 0) {
      throw new DatabaseError("No data found.");
    }

    res.success = true;
    res.data = labs;
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const getLabById = async (id: number) => {
  let res: DTOResponse<Laboratory | null> = {
    success: false,
    data: null,
    message: "",
  };
  try {
    if (!id) throw new ThrowableError("Please provide the laboratory id.");
    const labs = await database
      .select({
        id: laboratoriesTable.id,
        name: laboratoriesTable.name,
        address: laboratoriesTable.address,
        centreId: laboratoriesTable.centreId,
        centreName: researchCentresTable.name,
        isDeleted: laboratoriesTable.isDeleted,
      })
      .from(laboratoriesTable)
      .innerJoin(researchCentresTable, eq(laboratoriesTable.centreId, researchCentresTable.id))
      .where(and(eq(laboratoriesTable.id, id), eq(laboratoriesTable.isDeleted, false)));

    if (!labs) {
      throw new DatabaseError("Unable to access this Laboratory data because database query error. Please try again.");
    }
    if (labs.length == 0) {
      throw new DatabaseError("No data found.");
    }

    res.success = true;
    res.data = labs[0];
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};
