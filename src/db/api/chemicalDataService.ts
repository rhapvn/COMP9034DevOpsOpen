import database from "@/db/db";
import { DatabaseError } from "@/lib/DatabaseError";
import { chemicalDataTable } from "../schema";
import { and, desc, eq } from "drizzle-orm";
import { ThrowableError } from "@/lib/ThrowableError";
import { ChemicalData, DTOResponse } from "src/types";
import { revalidateTag } from "next/cache";

export const addChemicalData = async (chemicalData: Partial<ChemicalData>) => {
  let res: DTOResponse<{ id: number }> = {
    success: false,
    data: { id: -1 },
    message: "",
  };
  try {
    if (!chemicalData.commonName) throw new ThrowableError("Please provide the common name.");
    if (!chemicalData.systematicName) throw new ThrowableError("Please provide the systematic name.");
    if (!chemicalData.riskLevel) throw new ThrowableError("Please provide the risk level.");
    const data = {
      commonName: chemicalData.commonName,
      systematicName: chemicalData.systematicName,
      riskLevel: chemicalData.riskLevel,
      expiryPeriod: chemicalData.expiryPeriod,
    };
    const insertedResult = await database
      .insert(chemicalDataTable)
      .values(data)
      .returning({ chemicalId: chemicalDataTable.chemicalId });

    if (!insertedResult || insertedResult.length == 0) {
      throw new DatabaseError(
        "Unable to add this type of chemical details because database query error. Please try again.",
      );
    }

    res.success = true;
    res.data = { id: insertedResult[0].chemicalId };
    revalidateTag("chemicalUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const updateChemicalData = async (chemicalData: Partial<ChemicalData>) => {
  let res: DTOResponse<number> = {
    success: false,
    data: -1,
    message: "",
  };
  try {
    if (!chemicalData.chemicalId) throw new ThrowableError("Please provide the chemical id.");
    if (!chemicalData.commonName) throw new ThrowableError("Please provide the common name.");
    if (!chemicalData.systematicName) throw new ThrowableError("Please provide the systematic name.");
    if (!chemicalData.riskLevel) throw new ThrowableError("Please provide the risk level.");
    const updatedResult: { updatedId: number }[] = await database
      .update(chemicalDataTable)
      .set({
        commonName: chemicalData.commonName,
        systematicName: chemicalData.systematicName,
        riskLevel: chemicalData.riskLevel,
        expiryPeriod: chemicalData.expiryPeriod,
      })
      .where(eq(chemicalDataTable.chemicalId, chemicalData.chemicalId))
      .returning({ updatedId: chemicalDataTable.chemicalId });

    if (!updatedResult || updatedResult?.length == 0) {
      throw new DatabaseError("Unable to update this chemical details because database query error. Please try again.");
    }

    res.success = true;
    res.data = updatedResult[0].updatedId;
    revalidateTag("chemicalUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const removeChemicalData = async (id: number) => {
  let res: DTOResponse<number> = {
    success: false,
    data: -1,
    message: "",
  };
  try {
    if (!id) throw new ThrowableError("Please provide the chemical id.");
    const updatedResult: { updatedId: number }[] = await database
      .update(chemicalDataTable)
      .set({
        isDeleted: true,
      })
      .where(eq(chemicalDataTable.chemicalId, id))
      .returning({ updatedId: chemicalDataTable.chemicalId });

    if (!updatedResult || updatedResult?.length == 0) {
      throw new DatabaseError("Unable to remove this chemical data because database query error. Please try again.");
    }

    res.success = true;
    res.data = updatedResult[0].updatedId;
    revalidateTag("chemicalUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const getChemicalData = async () => {
  let res: DTOResponse<Array<ChemicalData>> = {
    success: false,
    data: [],
    message: "",
  };
  try {
    const chemicalDataList = await database
      .select()
      .from(chemicalDataTable)
      .where(eq(chemicalDataTable.isDeleted, false))
      .orderBy(desc(chemicalDataTable.chemicalId));

    if (!chemicalDataList) {
      throw new DatabaseError("Unable to access Chemical database because database query error. Please try again.");
    }
    if (chemicalDataList.length == 0) {
      throw new DatabaseError("No data found.");
    }

    res.success = true;
    res.data = chemicalDataList;
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const getChemicalDataById = async (id: number) => {
  let res: DTOResponse<ChemicalData | null> = {
    success: false,
    data: null,
    message: "",
  };
  try {
    const chemicalDataList = await database
      .select()
      .from(chemicalDataTable)
      .where(and(eq(chemicalDataTable.chemicalId, id), eq(chemicalDataTable.isDeleted, false)));

    if (!chemicalDataList) {
      throw new DatabaseError("Unable to access Chemical database because database query error. Please try again.");
    }
    if (chemicalDataList.length == 0) {
      throw new DatabaseError("No data found.");
    }

    res.success = true;
    res.data = chemicalDataList[0];
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};
