import database from "@/db/db";
import {
  chemicalAssigningTable,
  chemicalDataTable,
  experimentsTable,
  laboratoriesTable,
  researchCentresTable,
  usersTable,
} from "../schema";
import { sql, count, eq, and, or, inArray, isNull, asc } from "drizzle-orm";
import { DatabaseError } from "@/lib/DatabaseError";
import { ThrowableError } from "@/lib/ThrowableError";
import { DTOResponse, RSAStatType } from "src/types";
import { getSignedUser } from "@/lib/userUtils";

export const getRSAStatistics = async (): Promise<DTOResponse<RSAStatType | null>> => {
  let res: DTOResponse<RSAStatType | null> = {
    success: false,
    data: null,
    message: "",
  };

  try {
    const [requestStats, chemicalStats, summaryStats] = await Promise.all([
      getRequestStatistics(),
      getChemicalStatistics(),
      getMonthlyRequestsSummary(),
    ]);

    res.data = {
      requests: requestStats,
      chemicals: chemicalStats,
      summary: summaryStats,
    };
    res.success = true;
  } catch (error: any) {
    console.log(error);
    res.message = "Something went wrong with database connection. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }

  return res;
};

const getRequestStatistics = async (): Promise<RSAStatType["requests"]> => {
  const signedUser = await getSignedUser();
  console.log(signedUser);
  if (!signedUser) {
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      saved: 0,
    };
  }
  let requestStats: Array<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    saved?: number;
  }> = [];
  if (signedUser?.role === "researcher") {
    requestStats = await database
      .select({
        total: count(),
        pending: count(sql`CASE WHEN ${experimentsTable.status} IN ('submitted', 'escalated', 'approved') THEN 1 END`),
        approved: count(sql`CASE WHEN ${experimentsTable.status} = 'procured' THEN 1 END`),
        rejected: count(sql`CASE WHEN ${experimentsTable.status} = 'rejected' THEN 1 END`),
        saved: count(sql`CASE WHEN ${experimentsTable.status} = 'saved' THEN 1 END`),
      })
      .from(experimentsTable)
      .where(eq(experimentsTable.submittedUserId, parseInt(signedUser.id)));
  } else if (signedUser?.role === "supervisor") {
    requestStats = await database
      .select({
        total: count(),
        pending: count(sql`CASE WHEN ${experimentsTable.status} IN ('submitted') THEN 1 END`),
        approved: count(sql`CASE WHEN ${experimentsTable.status} IN ('escalated', 'approved', 'procured') THEN 1 END`),
        rejected: count(
          sql`CASE WHEN ${experimentsTable.status} = 'rejected' AND ${experimentsTable.secondApproverId} IS NULL AND ${experimentsTable.stockControlId} IS NULL THEN 1 END`,
        ),
      })
      .from(experimentsTable)
      .where(
        and(
          inArray(
            experimentsTable.placeTagId,
            database
              .select({ id: laboratoriesTable.id })
              .from(laboratoriesTable)
              .where(
                eq(
                  laboratoriesTable.centreId,
                  database
                    .select({ placeTagId: usersTable.placeTagId })
                    .from(usersTable)
                    .where(eq(usersTable.userId, parseInt(signedUser.id))),
                ),
              ),
          ),
          or(eq(experimentsTable.firstApproverId, parseInt(signedUser.id)), isNull(experimentsTable.firstApproverId)),
        ),
      );
  } else if (signedUser?.role === "approver") {
    requestStats = await database
      .select({
        total: count(),
        pending: count(sql`CASE WHEN ${experimentsTable.status} IN ('submitted', 'escalated') THEN 1 END`),
        approved: count(sql`CASE WHEN ${experimentsTable.status} IN ('approved', 'procured') THEN 1 END`),
        rejected: count(
          sql`CASE WHEN ${experimentsTable.status} = 'rejected' AND ${experimentsTable.stockControlId} IS NULL THEN 1 END`,
        ),
      })
      .from(experimentsTable)
      .where(
        and(
          inArray(
            experimentsTable.placeTagId,
            database
              .select({ id: laboratoriesTable.id })
              .from(laboratoriesTable)
              .where(
                inArray(
                  laboratoriesTable.centreId,
                  database
                    .select({ instituteId: researchCentresTable.instituteId })
                    .from(researchCentresTable)
                    .where(
                      eq(
                        researchCentresTable.instituteId,
                        database
                          .select({ placeTagId: usersTable.placeTagId })
                          .from(usersTable)
                          .where(eq(usersTable.userId, parseInt(signedUser.id))),
                      ),
                    ),
                ),
              ),
          ),
          or(eq(experimentsTable.secondApproverId, parseInt(signedUser.id)), isNull(experimentsTable.secondApproverId)),
        ),
      );
  }

  return requestStats[0];
};

const getChemicalStatistics = async (): Promise<RSAStatType["chemicals"]> => {
  const signedUser = await getSignedUser();
  console.log(signedUser);
  if (!signedUser) {
    return {
      total: 0,
      risk0_3: 0,
      risk4: 0,
      risk5: 0,
    };
  }
  let chemicalStats: Array<{
    total: number;
    risk0_3: number;
    risk4: number;
    risk5: number;
  }> = [];

  if (signedUser?.role === "researcher") {
    chemicalStats = await database
      .select({
        total: count(),
        risk0_3: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} BETWEEN 0 AND 3 THEN 1 END`),
        risk4: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} = 4 THEN 1 END`),
        risk5: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} = 5 THEN 1 END`),
      })
      .from(chemicalAssigningTable)
      .innerJoin(chemicalDataTable, eq(chemicalAssigningTable.chemicalId, chemicalDataTable.chemicalId))
      .innerJoin(experimentsTable, eq(chemicalAssigningTable.experimentId, experimentsTable.experimentId))
      .where(eq(experimentsTable.submittedUserId, parseInt(signedUser.id)));
  } else if (signedUser?.role === "supervisor") {
    chemicalStats = await database
      .select({
        total: count(),
        risk0_3: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} BETWEEN 0 AND 3 THEN 1 END`),
        risk4: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} = 4 THEN 1 END`),
        risk5: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} = 5 THEN 1 END`),
      })
      .from(chemicalAssigningTable)
      .innerJoin(chemicalDataTable, eq(chemicalAssigningTable.chemicalId, chemicalDataTable.chemicalId))
      .innerJoin(experimentsTable, eq(chemicalAssigningTable.experimentId, experimentsTable.experimentId))
      .where(
        and(
          inArray(
            experimentsTable.placeTagId,
            database
              .select({ id: laboratoriesTable.id })
              .from(laboratoriesTable)
              .where(
                eq(
                  laboratoriesTable.centreId,
                  database
                    .select({ placeTagId: usersTable.placeTagId })
                    .from(usersTable)
                    .where(eq(usersTable.userId, parseInt(signedUser.id))),
                ),
              ),
          ),
          or(eq(experimentsTable.firstApproverId, parseInt(signedUser.id)), isNull(experimentsTable.firstApproverId)),
        ),
      );
  } else if (signedUser?.role === "approver") {
    chemicalStats = await database
      .select({
        total: count(),
        risk0_3: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} BETWEEN 0 AND 3 THEN 1 END`),
        risk4: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} = 4 THEN 1 END`),
        risk5: count(sql`CASE WHEN ${chemicalDataTable.riskLevel} = 5 THEN 1 END`),
      })
      .from(chemicalAssigningTable)
      .innerJoin(chemicalDataTable, eq(chemicalAssigningTable.chemicalId, chemicalDataTable.chemicalId))
      .innerJoin(experimentsTable, eq(chemicalAssigningTable.experimentId, experimentsTable.experimentId))
      .where(
        and(
          inArray(
            experimentsTable.placeTagId,
            database
              .select({ id: laboratoriesTable.id })
              .from(laboratoriesTable)
              .where(
                inArray(
                  laboratoriesTable.centreId,
                  database
                    .select({ instituteId: researchCentresTable.instituteId })
                    .from(researchCentresTable)
                    .where(
                      eq(
                        researchCentresTable.instituteId,
                        database
                          .select({ placeTagId: usersTable.placeTagId })
                          .from(usersTable)
                          .where(eq(usersTable.userId, parseInt(signedUser.id))),
                      ),
                    ),
                ),
              ),
          ),
          or(eq(experimentsTable.secondApproverId, parseInt(signedUser.id)), isNull(experimentsTable.secondApproverId)),
        ),
      );
  }

  return chemicalStats[0];
};

const getMonthlyRequestsSummary = async (): Promise<RSAStatType["summary"]> => {
  const signedUser = await getSignedUser();
  console.log(signedUser);
  if (!signedUser) {
    return [
      {
        month_year: "",
        pending: 0,
        approved: 0,
        rejected: 0,
      },
    ];
  }
  let summaryStat: Array<{
    month_year: string | null;
    pending: number;
    approved: number;
    rejected: number;
  }> = [];
  if (signedUser?.role === "researcher") {
    summaryStat = await database
      .select({
        month_year: sql<string>`TO_CHAR(${experimentsTable.submissionDate}, 'Mon YYYY')`.as("month_year"),
        pending: count(sql`CASE WHEN ${experimentsTable.status} IN ('submitted', 'escalated', 'approved') THEN 1 END`),
        approved: count(sql`CASE WHEN ${experimentsTable.status} = 'procured' THEN 1 END`),
        rejected: count(sql`CASE WHEN ${experimentsTable.status} = 'rejected' THEN 1 END`),
      })
      .from(experimentsTable)
      .where(eq(experimentsTable.submittedUserId, parseInt(signedUser.id)))
      .groupBy(sql<string>`TO_CHAR(${experimentsTable.submissionDate}, 'Mon YYYY')`)
      .orderBy(sql<string>`TO_CHAR(${experimentsTable.submissionDate}, 'Mon YYYY')`);
  } else if (signedUser?.role === "supervisor") {
    summaryStat = await database
      .select({
        month_year: sql<string>`TO_CHAR(${experimentsTable.submissionDate}, 'Mon YYYY')`.as("month_year"),
        pending: count(sql`CASE WHEN ${experimentsTable.status} IN ('submitted') THEN 1 END`),
        approved: count(sql`CASE WHEN ${experimentsTable.status} IN ('escalated', 'approved') THEN 1 END`),
        rejected: count(sql`CASE WHEN ${experimentsTable.status} = 'rejected' THEN 1 END`),
      })
      .from(experimentsTable)
      .where(
        and(
          inArray(
            experimentsTable.placeTagId,
            database
              .select({ id: laboratoriesTable.id })
              .from(laboratoriesTable)
              .where(
                eq(
                  laboratoriesTable.centreId,
                  database
                    .select({ placeTagId: usersTable.placeTagId })
                    .from(usersTable)
                    .where(eq(usersTable.userId, parseInt(signedUser.id))),
                ),
              ),
          ),
          or(eq(experimentsTable.firstApproverId, parseInt(signedUser.id)), isNull(experimentsTable.firstApproverId)),
        ),
      )
      .groupBy(sql<string>`TO_CHAR(${experimentsTable.submissionDate}, 'Mon YYYY')`)
      .orderBy(asc(sql<string>`TO_CHAR(${experimentsTable.submissionDate}, 'Mon YYYY')`));
  } else if (signedUser?.role === "approver") {
    summaryStat = await database
      .select({
        month_year: sql<string>`TO_CHAR(${experimentsTable.submissionDate}, 'Mon YYYY')`.as("month_year"),
        pending: count(sql`CASE WHEN ${experimentsTable.status} IN ('submitted', 'escalated') THEN 1 END`),
        approved: count(sql`CASE WHEN ${experimentsTable.status} IN ('approved', 'procured') THEN 1 END`),
        rejected: count(sql`CASE WHEN ${experimentsTable.status} = 'rejected' THEN 1 END`),
      })
      .from(experimentsTable)
      .where(
        and(
          inArray(
            experimentsTable.placeTagId,
            database
              .select({ id: laboratoriesTable.id })
              .from(laboratoriesTable)
              .where(
                inArray(
                  laboratoriesTable.centreId,
                  database
                    .select({ instituteId: researchCentresTable.instituteId })
                    .from(researchCentresTable)
                    .where(
                      eq(
                        researchCentresTable.instituteId,
                        database
                          .select({ placeTagId: usersTable.placeTagId })
                          .from(usersTable)
                          .where(eq(usersTable.userId, parseInt(signedUser.id))),
                      ),
                    ),
                ),
              ),
          ),
          or(eq(experimentsTable.secondApproverId, parseInt(signedUser.id)), isNull(experimentsTable.secondApproverId)),
        ),
      )
      .groupBy(sql<string>`TO_CHAR(${experimentsTable.submissionDate}, 'Mon YYYY')`)
      .orderBy(sql<string>`TO_CHAR(${experimentsTable.submissionDate}, 'Mon YYYY')`);
  }
  return summaryStat;
};
