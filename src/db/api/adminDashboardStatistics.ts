import database from "@/db/db";
import { chemicalDataTable, institutesTable, laboratoriesTable, researchCentresTable, usersTable } from "../schema";
import { sql, count, eq } from "drizzle-orm";
import { DatabaseError } from "@/lib/DatabaseError";
import { ThrowableError } from "@/lib/ThrowableError";
import { DTOResponse } from "src/types";

type adminStatType = {
  users: {
    total: number;
    active: number;
    locked: number;
    deactivated: number;
  };
  chemicals: {
    total: number;
    risk0_3: number;
    risk4: number;
    risk5: number;
  };
  places: {
    total: number;
    institutes: number;
    centres: number;
    labs: number;
  };
};

export const getAdminStatistics = async(): Promise<DTOResponse<adminStatType | null>> => {
    let res: DTOResponse<adminStatType | null> = {
      success: false,
      data: null,
      message: ""
    };
  
    try {
      const [userStats, chemicalStats, placeStats] = await Promise.all([
        getUserStatistics(),
        getChemicalStatistics(),
        getPlaceStatistics()
      ]);
  
      res.data = {
        users: userStats,
        chemicals: chemicalStats,
        places: placeStats
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
  
  const getUserStatistics = async (): Promise<adminStatType['users']> => {
    const userStats = await database
      .select({
        total: count(),
        active: count(sql`CASE WHEN ${usersTable.status} = 'active' THEN 1 END`),
        locked: count(sql`CASE WHEN ${usersTable.status} = 'locked' THEN 1 END`),
        deactivated: count(sql`CASE WHEN ${usersTable.status} = 'deactivated' THEN 1 END`)
      })
      .from(usersTable);
  
    return userStats[0];
  }
  
  const getChemicalStatistics = async(): Promise<adminStatType['chemicals']> => {
    const chemicalStats = await database
      .select({
        total: count(),
        risk0_3: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} BETWEEN 0 AND 3 THEN 1 END`),
        risk4: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} = 4 THEN 1 END`),
        risk5: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} = 5 THEN 1 END`)
      })
      .from(chemicalDataTable).where(eq(chemicalDataTable.isDeleted, false));
  
    return chemicalStats[0];
  }
  
  const getPlaceStatistics = async(): Promise<adminStatType['places']> => {
    const [institutes, centres, labs] = await Promise.all([
      database.select({ count: count() }).from(institutesTable).where(eq(institutesTable.isDeleted, false)),
      database.select({ count: count() }).from(researchCentresTable).where(eq(researchCentresTable.isDeleted, false)),
      database.select({ count: count() }).from(laboratoriesTable).where(eq(laboratoriesTable.isDeleted, false))
    ]);
  
    return {
      total: institutes[0].count + centres[0].count + labs[0].count,
      institutes: institutes[0].count,
      centres: centres[0].count,
      labs: labs[0].count
    };
  }