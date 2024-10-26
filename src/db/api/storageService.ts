import database from "@/db/db";
import { DatabaseError } from "@/lib/DatabaseError";
import { institutesTable, laboratoriesTable, researchCentresTable, storageLocationsTable } from "../schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { ThrowableError } from "@/lib/ThrowableError";
import { DTOResponse, StorageLocation } from "src/types";
import { revalidateTag, unstable_cache } from "next/cache";

export const addStorage = async (storageData: Partial<StorageLocation>) => {
  let res: DTOResponse<{ id: number }> = {
    success: false,
    data: { id: -1 },
    message: "",
  };
  try {
    if (!storageData.storageName) throw new ThrowableError("Please provide the storage name.");
    if (!storageData.placeTag) throw new ThrowableError("Please provide the place tag.");
    if (!storageData.placeTagId) throw new ThrowableError("Please provide the place tag id.");
    if (!storageData.capacity) throw new ThrowableError("Please provide the capacity.");
    const data = {
      storageName: storageData.storageName,
      placeTag: storageData.placeTag,
      placeTagId: storageData.placeTagId,
      capacity: storageData.capacity,
      equipment: storageData.equipment,
    };
    const insertedResult = await database
      .insert(storageLocationsTable)
      .values(data)
      .returning({ storageId: storageLocationsTable.storageId });

    if (!insertedResult || insertedResult.length == 0) {
      throw new DatabaseError(
        "Unable to add this storage location details because database query error. Please try again.",
      );
    }

    res.success = true;
    res.data = { id: insertedResult[0].storageId };
    revalidateTag("labUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const updateStorage = async (storageData: Partial<StorageLocation>) => {
  let res: DTOResponse<number> = {
    success: false,
    data: -1,
    message: "",
  };
  try {
    if (!storageData.storageId) throw new ThrowableError("Please provide the storage id.");
    if (!storageData.storageName) throw new ThrowableError("Please provide the storage name.");
    if (!storageData.placeTag) throw new ThrowableError("Please provide the place tag.");
    if (!storageData.placeTagId) throw new ThrowableError("Please provide the place tag id.");
    if (!storageData.capacity) throw new ThrowableError("Please provide the capacity.");
    const updatedResult: { updatedId: number }[] = await database
      .update(storageLocationsTable)
      .set({
        storageName: storageData.storageName,
        capacity: storageData.capacity,
        equipment: storageData.equipment,
      })
      .where(eq(storageLocationsTable.storageId, storageData.storageId))
      .returning({ updatedId: storageLocationsTable.storageId });

    if (!updatedResult || updatedResult?.length == 0) {
      throw new DatabaseError(
        "Unable to update this storage location details because database query error. Please try again.",
      );
    }

    res.success = true;
    res.data = updatedResult[0].updatedId;
    revalidateTag("labUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const removeStorage = async (id: number) => {
  let res: DTOResponse<number> = {
    success: false,
    data: -1,
    message: "",
  };
  try {
    if (!id) throw new ThrowableError("Please provide the storage id.");
    const updatedResult: { updatedId: number }[] = await database
      .update(storageLocationsTable)
      .set({
        isDeleted: true,
      })
      .where(eq(storageLocationsTable.storageId, id))
      .returning({ updatedId: storageLocationsTable.storageId });

    if (!updatedResult || updatedResult?.length == 0) {
      throw new DatabaseError("Unable to remove this storage location because database query error. Please try again.");
    }

    res.success = true;
    res.data = updatedResult[0].updatedId;
    revalidateTag("labUpdate");
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const getStorages = async () => {
  let res: DTOResponse<Array<StorageLocation>> = {
    success: false,
    data: [],
    message: "",
  };
  try {
    const locations = await database
      .select({
        storageId: storageLocationsTable.storageId,
        storageName: storageLocationsTable.storageName,
        placeTag: storageLocationsTable.placeTag,
        placeTagId: storageLocationsTable.placeTagId,
        placeTagName: sql`COALESCE(${institutesTable.name}, ${researchCentresTable.name}, ${laboratoriesTable.name})`,
        capacity: storageLocationsTable.capacity,
        equipment: storageLocationsTable.equipment,
        isDeleted: storageLocationsTable.isDeleted,
      })
      .from(storageLocationsTable)
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
      .where(eq(storageLocationsTable.isDeleted, false))
      .orderBy(desc(storageLocationsTable.storageId));

    if (!locations) {
      throw new DatabaseError(
        "Unable to access Storage Location database because database query error. Please try again.",
      );
    }
    if (locations.length == 0) {
      throw new DatabaseError("No data found.");
    }

    res.success = true;
    res.data = locations;
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const getStorageById = async (id: number) => {
  let res: DTOResponse<StorageLocation | null> = {
    success: false,
    data: null,
    message: "",
  };
  try {
    if (!id) throw new ThrowableError("Please provide the storage location id.");
    const locations = await database
      .select({
        storageId: storageLocationsTable.storageId,
        storageName: storageLocationsTable.storageName,
        placeTag: storageLocationsTable.placeTag,
        placeTagId: storageLocationsTable.placeTagId,
        placeTagName: sql`COALESCE(${institutesTable.name}, ${researchCentresTable.name}, ${laboratoriesTable.name})`,
        capacity: storageLocationsTable.capacity,
        equipment: storageLocationsTable.equipment,
        isDeleted: storageLocationsTable.isDeleted,
      })
      .from(storageLocationsTable)
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
      .where(and(eq(storageLocationsTable.storageId, id), eq(storageLocationsTable.isDeleted, false)));

    if (!locations) {
      throw new DatabaseError(
        "Unable to access Storage Location database because database query error. Please try again.",
      );
    }
    if (locations.length == 0) {
      throw new DatabaseError("No data found.");
    }

    res.success = true;
    res.data = locations[0];
    return res;
  } catch (error: any) {
    res.message = "Something went wrong with database connection. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
    return res;
  }
};

export const getStoragesC = async () => {
  return unstable_cache(
    async () => {
      let res: DTOResponse<Array<StorageLocation>> = {
        success: false,
        data: [],
        message: "",
      };
      try {
        const locations = await database
          .select({
            storageId: storageLocationsTable.storageId,
            storageName: storageLocationsTable.storageName,
            placeTag: storageLocationsTable.placeTag,
            placeTagId: storageLocationsTable.placeTagId,
            placeTagName: sql`COALESCE(${institutesTable.name}, ${researchCentresTable.name}, ${laboratoriesTable.name})`,
            capacity: storageLocationsTable.capacity,
            equipment: storageLocationsTable.equipment,
            isDeleted: storageLocationsTable.isDeleted,
          })
          .from(storageLocationsTable)
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
          .where(eq(storageLocationsTable.isDeleted, false))
          .orderBy(desc(storageLocationsTable.storageId));

        if (!locations) {
          throw new DatabaseError(
            "Unable to access Storage Location database because database query error. Please try again.",
          );
        }
        if (locations.length == 0) {
          throw new DatabaseError("No data found.");
        }

        res.success = true;
        res.data = locations;
        return res;
      } catch (error: any) {
        res.message = "Something went wrong with database connection. Please try again.";
        if (error instanceof DatabaseError || error instanceof ThrowableError) {
          res.message = error.message;
        }
        return res;
      }
    },
    ["chemicalStorage"],
    {
      revalidate: 60 * 60,
      tags: ["chemicalStorage", "placeUpdate", "labUpdate"],
    },
  )();
};
