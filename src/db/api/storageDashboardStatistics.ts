import database from "@/db/db";
import { chemicalDataTable, disposalLogsTable, experimentsTable, institutesTable, laboratoriesTable, researchCentresTable, stockTable, storageLocationsTable, usersTable } from "../schema";
import { sql, count, eq, and, or, isNotNull, gt } from "drizzle-orm";
import { DatabaseError } from "@/lib/DatabaseError";
import { ThrowableError } from "@/lib/ThrowableError";
import { DTOResponse, StorageStatType } from "src/types";



export const getStorageStatistics = async(): Promise<DTOResponse<StorageStatType | null>> => {
    let res: DTOResponse<StorageStatType | null> = {
      success: false,
      data: null,
      message: ""
    };
  
    try {  
      const [requestStats, availableChemicalStats, availableChemicalInLocationStats, summaryStats] = await Promise.all([
        getRequestStatistics(),
        getAvailableChemicalStatistics(),
        getAvailableChemicalInLocationsStatistics(),
        getSummaryStatistics()
      ]);
  
      res.data = {
        requests: requestStats,
        availableChemicals: availableChemicalStats,
        availableChemicalsInLocations: availableChemicalInLocationStats,
        summarizedChemicals: summaryStats
      };
      res.success = true;
    } catch(error: any) {
      res.message = "Something went wrong with database connection. Please try again.";
      if(error instanceof DatabaseError || error instanceof ThrowableError) {
        res.message = error.message;
      }
    }
  
    return res;
  }
  
  const getRequestStatistics = async (): Promise<StorageStatType['requests']> => {
    const requestStats = await database
    .select({
      total: count(),
      pending: count(sql`CASE WHEN ${experimentsTable.status} = 'approved' THEN 1 END`),
      approved: count(sql`CASE WHEN ${experimentsTable.status} = 'procured' THEN 1 END`),
      rejected: count(
        sql`CASE WHEN ${experimentsTable.status} = 'rejected' AND ${experimentsTable.stockControlId} IS NOT NULL THEN 1 END`,
      ),
    })
    .from(experimentsTable)
    .where(
        or(
            eq(experimentsTable.status, 'approved'),
            isNotNull(experimentsTable.stockControlId)
        )
    );
    if(!requestStats || requestStats.length == 0) {
        return {
            total: 0,
            pending: 0,
            approved: 0,
            rejected: 0
        };
    }
  
    return requestStats[0];
  }
  
  const getAvailableChemicalStatistics = async(): Promise<StorageStatType['availableChemicals']> => {
    const chemicalStats = await database
      .select({
        total: count(),
        risk0_3: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} BETWEEN 0 AND 3 THEN 1 END`),
        risk4: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} = 4 THEN 1 END`),
        risk5: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} = 5 THEN 1 END`)
      })
      .from(stockTable)
      .innerJoin(chemicalDataTable, eq(stockTable.chemicalId, chemicalDataTable.chemicalId))
      .where(
        and(
            eq(stockTable.isOccupied, false),
            gt(stockTable.quantity, 0)
        )
    );
  
    if(!chemicalStats || chemicalStats.length == 0) {
        return {
            total: 0,
            risk0_3: 0,
            risk4: 0,
            risk5: 0
        };
    }
    return chemicalStats[0];
  }
  
  const getAvailableChemicalInLocationsStatistics = async(): Promise<StorageStatType['availableChemicalsInLocations']> => {
    const chemicalInLocations = await database.select({
        placeTag: storageLocationsTable.placeTag,
        total: count()
    }).from(stockTable)
    .innerJoin(storageLocationsTable, eq(stockTable.storageId, storageLocationsTable.storageId))
    .where(
        and(
            gt(stockTable.quantity, 0),
            eq(stockTable.isOccupied, false)
        )
    )
    .groupBy(storageLocationsTable.placeTag);
    if(!chemicalInLocations || chemicalInLocations?.length === 0) {
        return {
            total: 0,
            institute: 0,
            centre: 0,
            lab: 0
        };
    }
    const instituteCount = chemicalInLocations.filter((item) => item.placeTag == 'institute');
    const centreCount = chemicalInLocations.filter((item) => item.placeTag == 'researchCentre');
    const labCount = chemicalInLocations.filter((item) => item.placeTag == 'laboratory');
    return {
      total: instituteCount[0].total + centreCount[0].total + labCount[0].total,
      institute: instituteCount[0].total,
      centre: centreCount[0].total,
      lab: labCount[0].total
    };
  }

  const getSummaryStatistics = async(): Promise<StorageStatType['summarizedChemicals']> => {
    const [occupiedCount, availableCount, disposedCount] = await Promise.all([
      database.select({ count: count() }).from(stockTable).where(eq(stockTable.isOccupied, true)),
      database.select({ count: count() }).from(stockTable).where(and(gt(stockTable.quantity, 0), eq(stockTable.isOccupied, false))),
      database.select({ count: count() }).from(disposalLogsTable)
    ]);
  
    if(!occupiedCount && !availableCount && !disposedCount) {
        return {
            occupied: 0,
            available: 0,
            disposed: 0
        };
    }
    return {
      occupied: occupiedCount[0].count,
      available: availableCount[0].count,
      disposed: disposedCount[0].count
    };
  }