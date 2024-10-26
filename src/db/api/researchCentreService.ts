import database from "@/db/db";
import { DatabaseError } from "@/lib/DatabaseError";
import { institutesTable, researchCentresTable } from "../schema";
import { desc, eq, and } from "drizzle-orm";
import { ThrowableError } from "@/lib/ThrowableError";
import { DTOResponse, ResearchCentre } from "src/types";
import { revalidateTag } from "next/cache";

export const addResearchCentre = async (centerData: Partial<ResearchCentre>) => {
  let res: DTOResponse<{ id: number }> = {
    success: false,
    data: { id: -1 },
    message: "",
  };
  try {
    if (!centerData.name) throw new ThrowableError("Please provide the research centre name.");
    if (!centerData.instituteId)
      throw new ThrowableError("Please provide the institute id where this centre is located at.");
    const data = {
      name: centerData.name,
      address: centerData.address,
      instituteId: centerData.instituteId,
    };
    const insertedResult = await database
      .insert(researchCentresTable)
      .values(data)
      .returning({ id: researchCentresTable.id });

    if (!insertedResult || insertedResult.length == 0) {
      throw new DatabaseError("Failed to add this centre because database query error. Please try again.");
    }

    res.success = true;
    res.data = { id: insertedResult[0].id };
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

export const updateResearchCentre = async (centreData: Partial<ResearchCentre>) => {
  let res: DTOResponse<number> = {
    success: false,
    data: -1,
    message: "",
  };
  try {
    if (!centreData.id) throw new ThrowableError("Please provide the research centre id.");
    if (!centreData.name) throw new ThrowableError("Please provide the research centre name.");
    if (!centreData.instituteId) throw new ThrowableError("Please provide the institute id.");

    const updatedResult: { updatedId: number }[] = await database
      .update(researchCentresTable)
      .set({
        name: centreData.name,
        address: centreData.address,
        instituteId: centreData.instituteId,
      })
      .where(eq(researchCentresTable.id, centreData.id))
      .returning({ updatedId: researchCentresTable.id });

    if (!updatedResult || updatedResult?.length == 0) {
      throw new DatabaseError("Unable to update this centre because database query error. Please try again.");
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

export const removeResearchCentre = async (centreId: number) => {
  let res: DTOResponse<number> = {
    success: false,
    data: -1,
    message: "",
  };
  try {
    if (!centreId) throw new ThrowableError("Please provide the research centre id.");
    const result: { updatedId: number }[] = await database
      .update(researchCentresTable)
      .set({
        isDeleted: true,
      })
      .where(eq(researchCentresTable.id, centreId))
      .returning({ updatedId: researchCentresTable.id });

    if (!result || result?.length == 0) {
      throw new DatabaseError("Unable to remove this centre because database query error. Please try again.");
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

export const getResearchCentres = async () => {
  let res: DTOResponse<Array<ResearchCentre>> = {
    success: false,
    data: [],
    message: "",
  };
  try {
    const centres = await database
      .select({
        id: researchCentresTable.id,
        name: researchCentresTable.name,
        address: researchCentresTable.address,
        instituteId: researchCentresTable.instituteId,
        instituteName: institutesTable.name,
        isDeleted: researchCentresTable.isDeleted,
      })
      .from(researchCentresTable)
      .innerJoin(institutesTable, eq(researchCentresTable.instituteId, institutesTable.id))
      .where(eq(researchCentresTable.isDeleted, false))
      .orderBy(desc(researchCentresTable.id));

    if (!centres) {
      throw new DatabaseError(
        "Unable to access Research centre database because database query error. Please try again.",
      );
    }
    if (centres.length == 0) {
      throw new DatabaseError("No data found.");
    }

    res.success = true;
    res.data = centres;
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const getResearchCentreById = async (id: number) => {
  let res: DTOResponse<ResearchCentre | null> = {
    success: false,
    data: null,
    message: "",
  };
  try {
    if (!id) throw new ThrowableError("Please provide the research centre id.");
    const centre = await database
      .select({
        id: researchCentresTable.id,
        name: researchCentresTable.name,
        address: researchCentresTable.address,
        instituteId: researchCentresTable.instituteId,
        instituteName: institutesTable.name,
        isDeleted: researchCentresTable.isDeleted,
      })
      .from(researchCentresTable)
      .innerJoin(institutesTable, eq(researchCentresTable.instituteId, institutesTable.id))
      .where(and(eq(researchCentresTable.id, id), eq(researchCentresTable.isDeleted, false)));

    if (!centre) {
      throw new DatabaseError(
        "Unable to access this Research centre data because database query error. Please try again.",
      );
    }
    if (centre.length == 0) {
      throw new DatabaseError("No data found.");
    }

    res.success = true;
    res.data = centre[0];
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};
