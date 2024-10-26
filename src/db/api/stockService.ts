import database from "@/db/db";
import {
  chemicalDataTable,
  institutesTable,
  laboratoriesTable,
  researchCentresTable,
  stockTable,
  storageLocationsTable,
  placeTagEnum,
  disposalLogsTable,
  usersTable,
} from "../schema";
import { sql, eq, and, desc, gt, asc } from "drizzle-orm";
import { DatabaseError } from "@/lib/DatabaseError";
import { ThrowableError } from "@/lib/ThrowableError";
import { ChemicalStock, DisposalLog, DTOResponse, Stock, StockTakeList } from "src/types";
import { getSignedUser } from "@/lib/userUtils";
import { revalidateTag } from "next/cache";
import { unstable_cache } from "next/cache";

export const getChemicalStock = async () => {
  let res: DTOResponse<ChemicalStock[]> = {
    success: false,
    data: [],
    message: "",
  };

  try {
    const stocks = await database
      .select({
        stockId: sql<number>`${stockTable.stockId}`,
        storageId: sql<number>`${stockTable.storageId}`,
        chemicalId: sql<number>`${stockTable.chemicalId}`,
        quantity: stockTable.quantity,
        expiryDate: stockTable.expiryDate,
        lastUpdatedBy: sql<number>`${stockTable.lastUpdatedBy}`,
        lastUpdatedTime: stockTable.lastUpdatedTime,
        isOccupied: stockTable.isOccupied,
        storageName: storageLocationsTable.storageName,
        commonName: chemicalDataTable.commonName,
        riskLevel: chemicalDataTable.riskLevel,
        systematicName: chemicalDataTable.systematicName,
        placeTag: storageLocationsTable.placeTag,
        placeTagId: storageLocationsTable.placeTagId,
        placeName: sql<string>`COALESCE(${institutesTable.name}, ${researchCentresTable.name}, ${laboratoriesTable.name})`,
      })
      .from(stockTable)
      .innerJoin(storageLocationsTable, eq(stockTable.storageId, storageLocationsTable.storageId))
      .innerJoin(chemicalDataTable, eq(stockTable.chemicalId, chemicalDataTable.chemicalId))
      .leftJoin(
        institutesTable,
        sql`${storageLocationsTable.placeTag} = 'institute' AND ${storageLocationsTable.placeTagId} = ${institutesTable.id}`,
      )
      .leftJoin(
        researchCentresTable,
        sql`${storageLocationsTable.placeTag} = 'researchCentre' AND ${storageLocationsTable.placeTagId} = ${researchCentresTable.id}`,
      )
      .leftJoin(
        laboratoriesTable,
        sql`${storageLocationsTable.placeTag} = 'laboratory' AND ${storageLocationsTable.placeTagId} = ${laboratoriesTable.id}`,
      )
      .orderBy(desc(stockTable.stockId));

    if (!stocks) throw new DatabaseError("Unable to get chemical stock data due to query issues. Please try again.");
    if (stocks?.length === 0) {
      res.success = true;
      res.data = [];
      res.message = "No chemical stock data found.";
    } else {
      res.success = true;
      res.data = stocks;
    }
  } catch (error: any) {
    console.log(error);
    res.message = "Something went wrong with database query. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }

  return res;
};

export const updateChemicalQuantity = async (params: { newQuantity: number; stockId: number }) => {
  let res: DTOResponse<{ id: number }> = {
    success: false,
    data: { id: -1 },
    message: "",
  };

  try {
    const signedUser = await getSignedUser();
    if (!signedUser) throw new ThrowableError("Please sign in before proceeding.");
    if (signedUser?.role != "storage") {
      throw new ThrowableError("You don't have permission to update any chemicals.");
    }
    if (!params.newQuantity || params.newQuantity <= 0)
      throw new ThrowableError("Please provide the quantity that is more than zero.");

    const updatedResult: { stockId: number }[] = await database
      .update(stockTable)
      .set({
        quantity: params.newQuantity,
        lastUpdatedBy: parseInt(signedUser.id),
        lastUpdatedTime: sql`NOW()`,
      })
      .where(eq(stockTable.stockId, params.stockId))
      .returning({ stockId: stockTable.stockId });

    if (!updatedResult || updatedResult?.length === 0)
      throw new DatabaseError("Unable to update the quantity of this chemical due to query issues. Please try again.");

    res.success = true;
    res.data = { id: updatedResult[0].stockId };
    // revalidateTag("stockUpdate");
  } catch (error: any) {
    console.log(error);
    res.message = "Something went wrong with database query. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }

  return res;
};

export const disposeChemical = async (params: { stockId: number; chemicalId: number }) => {
  let res: DTOResponse<{ disposalId: number }> = {
    success: false,
    data: { disposalId: -1 },
    message: "",
  };

  try {
    const signedUser = await getSignedUser();
    if (!signedUser) throw new ThrowableError("Please sign in before proceeding.");
    if (signedUser?.role != "storage" && signedUser?.role != "researcher") {
      throw new ThrowableError("You don't have permission to dispose any chemicals.");
    }
    if (!params.stockId || params.stockId < 1) {
      throw new ThrowableError("Please provide valid stock id.");
    }
    if (!params.chemicalId || params.chemicalId < 1) {
      throw new ThrowableError("Please provide valid chemical id.");
    }

    const newDisposal = await database
      .insert(disposalLogsTable)
      .values({
        chemicalId: params.chemicalId,
        stockId: params.stockId,
        disposalDate: sql`NOW()`,
        confirmBy: parseInt(signedUser.id),
      })
      .returning({ disposalId: disposalLogsTable.disposalId });

    if (!newDisposal || newDisposal?.length === 0) {
      throw new DatabaseError("Unable to dispose this chemical due to query issues. Please try again.");
    }

    if (signedUser?.role === "storage") {
      const updateChemicalStatus = await database
        .update(stockTable)
        .set({
          isOccupied: true,
          lastUpdatedBy: parseInt(signedUser.id),
          lastUpdatedTime: sql`NOW()`,
        })
        .where(and(eq(stockTable.stockId, params.stockId), eq(stockTable.chemicalId, params.chemicalId)))
        .returning({ stockId: stockTable.stockId });
      if (!updateChemicalStatus || updateChemicalStatus?.length === 0) {
        await database
          .delete(disposalLogsTable)
          .where(eq(disposalLogsTable.disposalId, newDisposal[0].disposalId))
          .returning();
        throw new DatabaseError("Unable to update this chemical status due to query issues. Please try again.");
      }
    }
    res.success = true;
    res.data = { disposalId: newDisposal[0].disposalId };
    // revalidateTag("stockUpdate");
  } catch (error: any) {
    console.log(error);
    res.message = "Something went wrong with database query. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }

  return res;
};
export const recordChemical = async (newChemicalData: Stock) => {
  let res: DTOResponse<{ stockId: number }> = {
    success: false,
    data: { stockId: -1 },
    message: "",
  };

  try {
    const signedUser = await getSignedUser();
    if (!signedUser) throw new ThrowableError("Please sign in before proceeding.");
    if (signedUser?.role !== "storage") throw new ThrowableError("You don't have permission to record new chemical.");

    const result = await database
      .insert(stockTable)
      .values({
        storageId: newChemicalData.storageId,
        chemicalId: newChemicalData.chemicalId,
        quantity: newChemicalData.quantity,
        expiryDate: newChemicalData.expiryDate,
        lastUpdatedBy: parseInt(signedUser.id),
        lastUpdatedTime: sql`NOW()`,
      })
      .returning({ stockId: stockTable.stockId });

    if (!result || result?.length === 0)
      throw new DatabaseError("Unable to save the new chemical details. Please check your inputs and try again.");

    res.success = true;
    res.data = { stockId: result[0].stockId };
    // revalidateTag("stockUpdate");
  } catch (error: any) {
    console.log(error);
    res.message = "Something went wrong with database query. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }

  return res;
};
export const getChemicalListByStorageId = async (storageId: number) => {
  let res: DTOResponse<
    Array<
      Stock & {
        storageName?: string;
        placeTag?: string;
        placeTagId?: number;
        placeName?: string;
      }
    >
  > = {
    success: false,
    data: [],
    message: "",
  };

  try {
    const chemicalStocks = await database
      .select({
        stockId: stockTable.stockId,
        storageId: sql<number>`${stockTable.storageId}`,
        storageName: storageLocationsTable.storageName,
        placeTag: storageLocationsTable.placeTag,
        placeTagId: storageLocationsTable.placeTagId,
        placeName: sql<string>`COALESCE(${institutesTable.name}, ${researchCentresTable.name}, ${laboratoriesTable.name})`,
        chemicalId: chemicalDataTable.chemicalId,
        commonName: chemicalDataTable.commonName,
        systematicName: chemicalDataTable.systematicName,
        riskLevel: chemicalDataTable.riskLevel,
        quantity: stockTable.quantity,
        expiryDate: stockTable.expiryDate,
        lastUpdatedBy: sql<number>`${stockTable.lastUpdatedBy}`,
        lastUpdatedTime: stockTable.lastUpdatedTime,
        isOccupied: stockTable.isOccupied,
      })
      .from(stockTable)
      .innerJoin(chemicalDataTable, eq(stockTable.chemicalId, chemicalDataTable.chemicalId))
      .innerJoin(storageLocationsTable, eq(stockTable.storageId, storageLocationsTable.storageId))
      .leftJoin(
        institutesTable,
        sql`${storageLocationsTable.placeTag} = 'institute' AND ${storageLocationsTable.placeTagId} = ${institutesTable.id}`,
      )
      .leftJoin(
        researchCentresTable,
        sql`${storageLocationsTable.placeTag} = 'researchCentre' AND ${storageLocationsTable.placeTagId} = ${researchCentresTable.id}`,
      )
      .leftJoin(
        laboratoriesTable,
        sql`${storageLocationsTable.placeTag} = 'laboratory' AND ${storageLocationsTable.placeTagId} = ${laboratoriesTable.id}`,
      )
      .where(eq(stockTable.storageId, storageId))
      .orderBy(desc(stockTable.stockId));

    if (!chemicalStocks) throw new DatabaseError("Unable to retrieve the data due to query issues. Please try again.");
    if (chemicalStocks?.length === 0) {
      res.success = true;
      res.data = [];
      res.message = "No chemical data found.";
    } else {
      res.success = true;
      res.data = chemicalStocks;
    }
  } catch (error: any) {
    console.log(error);
    res.message = "Something went wrong with database query. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }

  return res;
};
export const getChemicalDisposalByStorageId = async (storageId: number) => {
  let res: DTOResponse<
    Array<
      DisposalLog & {
        commonName?: string;
        systematicName?: string;
        riskLevel?: number;
        storageId?: number;
        storageName?: string;
      }
    >
  > = {
    success: false,
    data: [],
    message: "",
  };

  try {
    const disposalLogs = await database
      .select({
        disposalId: disposalLogsTable.disposalId,
        chemicalId: sql<number>`${disposalLogsTable.chemicalId}`,
        commonName: chemicalDataTable.commonName,
        systematicName: chemicalDataTable.systematicName,
        riskLevel: chemicalDataTable.riskLevel,
        stockId: sql<number>`${disposalLogsTable.stockId}`,
        disposalDate: disposalLogsTable.disposalDate,
        quantity: sql<number>`${stockTable.quantity}`,
        confirmById: sql<number>`${disposalLogsTable.confirmBy}`,
        confirmByName: sql<string>`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`,
        storageId: sql<number>`${stockTable.storageId}`,
        storageName: storageLocationsTable.storageName,
      })
      .from(disposalLogsTable)
      .innerJoin(stockTable, eq(disposalLogsTable.stockId, stockTable.stockId))
      .innerJoin(chemicalDataTable, eq(disposalLogsTable.chemicalId, chemicalDataTable.chemicalId))
      .innerJoin(storageLocationsTable, eq(stockTable.storageId, storageLocationsTable.storageId))
      .innerJoin(usersTable, eq(disposalLogsTable.confirmBy, usersTable.userId))
      .where(eq(stockTable.storageId, storageId))
      .orderBy(desc(disposalLogsTable.disposalId));

    if (!disposalLogs) throw new DatabaseError("Unable to retrieve chemical disposal logs.");
    if (disposalLogs.length === 0) {
      res.success = true;
      res.data = [];
      res.message = "No disposal logs found!";
    } else {
      res.success = true;
      res.data = disposalLogs;
    }
  } catch (error: any) {
    console.log(error);
    res.message = "Something went wrong with database query. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }

  return res;
};

export const getStockTakeListByStorageId = async (storageId: number) => {
  let res: DTOResponse<Array<StockTakeList>> = {
    success: false,
    data: [],
    message: "",
  };

  try {
    const stockTakeList = await database
      .select({
        stockId: stockTable.stockId,
        storageId: sql<number>`${stockTable.storageId}`,
        chemicalId: chemicalDataTable.chemicalId,
        commonName: chemicalDataTable.commonName,
        systematicName: chemicalDataTable.systematicName,
        quantity: stockTable.quantity,
        expiryDate: stockTable.expiryDate,
        lastUpdatedBy: sql<number>`${stockTable.lastUpdatedBy}`,
        lastUpdatedTime: stockTable.lastUpdatedTime,
        confirmBy: sql<string>`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`,
        takeDate: stockTable.lastUpdatedTime,
        isOccupied: stockTable.isOccupied,
      })
      .from(stockTable)
      .innerJoin(chemicalDataTable, eq(stockTable.chemicalId, chemicalDataTable.chemicalId))
      .leftJoin(usersTable, eq(stockTable.lastUpdatedBy, usersTable.userId))
      .where(and(eq(stockTable.storageId, storageId), eq(stockTable.isOccupied, true)))
      .orderBy(desc(stockTable.stockId));

    if (!stockTakeList) throw new DatabaseError("Unable to retrieve the data due to query issues. Please try again.");
    if (stockTakeList?.length === 0) {
      res.success = true;
      res.data = [];
      res.message = "No stock take list found.";
    } else {
      res.success = true;
      res.data = stockTakeList;
    }
  } catch (error: any) {
    console.log(error);
    res.message = "Something went wrong with database query. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }

  return res;
};

export const getAvailableChemicalsInStockC = async () => {
  return unstable_cache(
    async () => {
      let res: DTOResponse<ChemicalStock[]> = {
        success: false,
        data: [],
        message: "",
      };

      try {
        const stocks = await database
          .select({
            stockId: sql<number>`${stockTable.stockId}`,
            storageId: sql<number>`${stockTable.storageId}`,
            chemicalId: sql<number>`${stockTable.chemicalId}`,
            quantity: stockTable.quantity,
            expiryDate: stockTable.expiryDate,
            lastUpdatedBy: sql<number>`${stockTable.lastUpdatedBy}`,
            lastUpdatedTime: stockTable.lastUpdatedTime,
            isOccupied: stockTable.isOccupied,
            storageName: storageLocationsTable.storageName,
            commonName: chemicalDataTable.commonName,
            riskLevel: chemicalDataTable.riskLevel,
            systematicName: chemicalDataTable.systematicName,
            placeTag: storageLocationsTable.placeTag,
            placeTagId: storageLocationsTable.placeTagId,
            placeName: sql<string>`COALESCE(${institutesTable.name}, ${researchCentresTable.name}, ${laboratoriesTable.name})`,
          })
          .from(stockTable)
          .innerJoin(storageLocationsTable, eq(stockTable.storageId, storageLocationsTable.storageId))
          .innerJoin(chemicalDataTable, eq(stockTable.chemicalId, chemicalDataTable.chemicalId))
          .leftJoin(
            institutesTable,
            sql`${storageLocationsTable.placeTag} = 'institute' AND ${storageLocationsTable.placeTagId} = ${institutesTable.id}`,
          )
          .leftJoin(
            researchCentresTable,
            sql`${storageLocationsTable.placeTag} = 'researchCentre' AND ${storageLocationsTable.placeTagId} = ${researchCentresTable.id}`,
          )
          .leftJoin(
            laboratoriesTable,
            sql`${storageLocationsTable.placeTag} = 'laboratory' AND ${storageLocationsTable.placeTagId} = ${laboratoriesTable.id}`,
          )
          .where(and(eq(stockTable.isOccupied, false), gt(stockTable.quantity, 0)))
          .orderBy(asc(stockTable.stockId));

        if (!stocks)
          throw new DatabaseError("Unable to get chemical stock data due to query issues. Please try again.");
        if (stocks?.length === 0) {
          res.success = true;
          res.data = [];
          res.message = "No chemical stock data found.";
        } else {
          res.success = true;
          res.data = stocks;
        }
      } catch (error: any) {
        console.log(error);
        res.message = "Something went wrong with database query. Please try again.";
        if (error instanceof DatabaseError || error instanceof ThrowableError) {
          res.message = error.message;
        }
      }

      return res;
    },
    ["chemicalStock"],
    {
      revalidate: 60 * 60,
      tags: ["stockUpdate", "chemicalUpdate", "placeUpdate", "labUpdate"],
    },
  )();
};

export const getAvailableChemicalsInStock = async () => {
  let res: DTOResponse<ChemicalStock[]> = {
    success: false,
    data: [],
    message: "",
  };

  try {
    const stocks = await database
      .select({
        stockId: sql<number>`${stockTable.stockId}`,
        storageId: sql<number>`${stockTable.storageId}`,
        chemicalId: sql<number>`${stockTable.chemicalId}`,
        quantity: stockTable.quantity,
        expiryDate: stockTable.expiryDate,
        lastUpdatedBy: sql<number>`${stockTable.lastUpdatedBy}`,
        lastUpdatedTime: stockTable.lastUpdatedTime,
        isOccupied: stockTable.isOccupied,
        storageName: storageLocationsTable.storageName,
        commonName: chemicalDataTable.commonName,
        riskLevel: chemicalDataTable.riskLevel,
        systematicName: chemicalDataTable.systematicName,
        placeTag: storageLocationsTable.placeTag,
        placeTagId: storageLocationsTable.placeTagId,
        placeName: sql<string>`COALESCE(${institutesTable.name}, ${researchCentresTable.name}, ${laboratoriesTable.name})`,
      })
      .from(stockTable)
      .innerJoin(storageLocationsTable, eq(stockTable.storageId, storageLocationsTable.storageId))
      .innerJoin(chemicalDataTable, eq(stockTable.chemicalId, chemicalDataTable.chemicalId))
      .leftJoin(
        institutesTable,
        sql`${storageLocationsTable.placeTag} = 'institute' AND ${storageLocationsTable.placeTagId} = ${institutesTable.id}`,
      )
      .leftJoin(
        researchCentresTable,
        sql`${storageLocationsTable.placeTag} = 'researchCentre' AND ${storageLocationsTable.placeTagId} = ${researchCentresTable.id}`,
      )
      .leftJoin(
        laboratoriesTable,
        sql`${storageLocationsTable.placeTag} = 'laboratory' AND ${storageLocationsTable.placeTagId} = ${laboratoriesTable.id}`,
      )
      .where(and(eq(stockTable.isOccupied, false), gt(stockTable.quantity, 0)))
      .orderBy(asc(stockTable.stockId));

    if (!stocks) throw new DatabaseError("Unable to get chemical stock data due to query issues. Please try again.");
    if (stocks?.length === 0) {
      res.success = true;
      res.data = [];
      res.message = "No chemical data in stock found.";
    } else {
      res.success = true;
      res.data = stocks;
    }
  } catch (error: any) {
    console.log(error);
    res.message = "Something went wrong with database query. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }

  return res;
};
