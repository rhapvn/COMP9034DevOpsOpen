import database from "@/db/db";
import {
  chemicalAssigningTable,
  chemicalDataTable,
  disposalLogsTable,
  experimentsTable,
  experimentStatusEnum,
  institutesTable,
  laboratoriesTable,
  researchCentresTable,
  stockTable,
  storageLocationsTable,
  usersTable,
} from "../schema";
import { sql, eq, and, asc, desc, aliasedTable, or, isNull } from "drizzle-orm";
import { DatabaseError } from "@/lib/DatabaseError";
import { ThrowableError } from "@/lib/ThrowableError";
import {
  ChemicalAssigningType,
  ChemicalStock,
  DTOResponse,
  Experiment,
  ExperimentDetailsWithLab,
  LoginUser,
} from "src/types";
import { getSignedUser } from "@/lib/userUtils";
import { revalidateTag, unstable_cache } from "next/cache";
import { getLabs } from "./labService";

type ExperimentWithName = Experiment & {
  submittedUserName?: string;
  firstApproverName?: string;
  secondApproverName?: string;
  stockControlName?: string;
};

type ChemicalList = Array<
  ChemicalAssigningType & {
    commonName?: string;
    systematicName?: string;
    riskLevel?: number;
    pickupStorage?: string;
    placeName?: string;
  }
>;

type ExperimentDetails = { experimentDetails: Partial<ExperimentWithName>; chemicalList: ChemicalList };

export const addExperiment = async (
  requestDetails: Partial<Experiment>,
  chemicalItems: Array<ChemicalAssigningType>,
) => {
  let res: DTOResponse<{ id: number }> = {
    success: false,
    data: { id: -1 },
    message: "",
  };
  try {
    const signedUser = await getSignedUser();
    if (!signedUser) throw new ThrowableError("Please sign in before proceeding the request.");
    if (signedUser?.role != "researcher")
      throw new ThrowableError("Sorry, you don't have permission to make a request.");

    if (!requestDetails.experimentDetails) throw new ThrowableError("Please provide the experiment details.");
    if (!requestDetails.isRiskAssessmentDone)
      throw new ThrowableError("Please determine whether the risk assessment is done.");
    if (!requestDetails.highestRiskLevel) throw new ThrowableError("Please provide the highest risk level.");
    if (!requestDetails.placeTagId) throw new ThrowableError("Please provide the place tag id.");
    if (!requestDetails.experimentEndDate) throw new ThrowableError("Please provide the experiment end date.");
    if (!chemicalItems || chemicalItems?.length === 0)
      throw new ThrowableError("Please provide your requested chemical list.");

    await database.transaction(async (tx) => {
      const insertResult = await tx
        .insert(experimentsTable)
        .values({
          experimentDetails: requestDetails.experimentDetails!,
          isRiskAssessmentDone: requestDetails.isRiskAssessmentDone!,
          highestRiskLevel: requestDetails.highestRiskLevel!,
          status: experimentStatusEnum.enumValues[1],
          submissionDate: sql`NOW()`,
          submittedUserId: parseInt(signedUser.id),
          placeTagId: requestDetails.placeTagId!,
          experimentEndDate: requestDetails.experimentEndDate!,
        })
        .returning({ experimentId: experimentsTable.experimentId });

      if (!insertResult || insertResult?.length === 0) {
        throw new DatabaseError("Failed to insert request details. Please re-check the details and try again.");
      }

      let chemicalList: Array<ChemicalAssigningType> = [];
      chemicalItems.forEach((item) => {
        if (!item.chemicalId) throw new ThrowableError(`Please specify the chemical id`);
        if (!item.quantity) throw new ThrowableError(`Please specify the quantity of chemical id: ${item.chemicalId}`);
        chemicalList.push({
          experimentId: insertResult[0].experimentId,
          chemicalId: item.chemicalId,
          quantity: item.quantity,
        });
      });
      const insertedChemicalList = await tx
        .insert(chemicalAssigningTable)
        .values(chemicalList)
        .returning({ id: chemicalAssigningTable.id });

      if (!insertedChemicalList || insertedChemicalList?.length === 0) {
        tx.rollback();
        throw new ThrowableError("Failed to insert chemical items. Please try again.");
      }
      res.success = true;
      res.data = { id: insertResult[0].experimentId };
      res.message = "Successfully submitted the experiment request.";
      revalidateTag("allRequests");
    });
  } catch (error: any) {
    res.message = "Something went wrong with database query. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }
  return res;
};
export async function getPendingRequests() {
  const signedUser = await getSignedUser();
  if (!signedUser) {
    return {
      success: false,
      data: [],
      message: "Please sign in before proceeding.",
    };
  }
  if (signedUser?.role === "researcher" || signedUser?.role === "admin") {
    return {
      success: false,
      data: [],
      message: "You don't have permission to access this route.",
    };
  }
  return cachedGetPendingRequests(parseInt(signedUser?.id), signedUser?.role);
}

const cachedGetPendingRequests = async (userId: number, userRole: string) => {
  let res: DTOResponse<Array<ExperimentWithName>> = {
    success: false,
    data: [],
    message: "",
  };
  try {
    let pendingRequests: Array<ExperimentWithName> = [];
    const supervisorTable = aliasedTable(usersTable, "supervisorTable");
    const approverTable = aliasedTable(usersTable, "approverTable");
    const stockPersonTable = aliasedTable(usersTable, "stockPersonTable");

    if (userRole === "supervisor") {
      const supervisorInfo = await database
        .select({
          placeTagId: usersTable.placeTagId,
        })
        .from(usersTable)
        .where(eq(usersTable.userId, userId))
        .limit(1);

      if (!supervisorInfo.length) throw new ThrowableError("Supervisor information not found.");

      pendingRequests = await database
        .select({
          experimentId: experimentsTable.experimentId,
          experimentDetails: experimentsTable.experimentDetails,
          isRiskAssessmentDone: experimentsTable.isRiskAssessmentDone,
          highestRiskLevel: experimentsTable.highestRiskLevel,
          status: experimentsTable.status,
          lastSavedDate: experimentsTable.lastSavedDate,
          submissionDate: experimentsTable.submissionDate,
          submittedUserId: sql<number>`${experimentsTable.submittedUserId}`,
          submittedUserName: sql<string>`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`,
          placeTagId: experimentsTable.placeTagId,
          placeName: laboratoriesTable.name,
          placeAddress: laboratoriesTable.address,
          centreId: laboratoriesTable.centreId,
          isPlaceDeleted: laboratoriesTable.isDeleted,
          experimentEndDate: experimentsTable.experimentEndDate,
          firstApproverId: experimentsTable.firstApproverId,
          firstApproverName: sql`CONCAT(${supervisorTable.firstName}, ' ', ${supervisorTable.lastName})`,
          firstApprovalTime: experimentsTable.firstApprovalTime,
          firstApproverComments: experimentsTable.firstApproverComments,
          secondApproverId: experimentsTable.secondApproverId,
          secondApproverName: sql`CONCAT(${approverTable.firstName}, ' ', ${approverTable.lastName})`,
          secondApprovalTime: experimentsTable.secondApprovalTime,
          secondApproverComments: experimentsTable.secondApproverComments,
          stockControlId: experimentsTable.stockControlId,
          stockControlName: sql`CONCAT(${stockPersonTable.firstName}, ' ', ${stockPersonTable.lastName})`,
          stockControlCheckedTime: experimentsTable.stockControlCheckedTime,
          stockControlComments: experimentsTable.stockControlComments,
        })
        .from(experimentsTable)
        .innerJoin(usersTable, eq(experimentsTable.submittedUserId, usersTable.userId))
        .innerJoin(laboratoriesTable, eq(experimentsTable.placeTagId, laboratoriesTable.id))
        .innerJoin(researchCentresTable, eq(laboratoriesTable.centreId, researchCentresTable.id))
        .leftJoin(supervisorTable, eq(supervisorTable.userId, experimentsTable.firstApproverId))
        .leftJoin(approverTable, eq(approverTable.userId, experimentsTable.secondApproverId))
        .leftJoin(stockPersonTable, eq(stockPersonTable.userId, experimentsTable.stockControlId))
        .where(and(eq(experimentsTable.status, "submitted"), eq(researchCentresTable.id, supervisorInfo[0].placeTagId)))
        .orderBy(desc(experimentsTable.submissionDate));
    } else if (userRole === "approver") {
      pendingRequests = await database
        .select({
          experimentId: experimentsTable.experimentId,
          experimentDetails: experimentsTable.experimentDetails,
          isRiskAssessmentDone: experimentsTable.isRiskAssessmentDone,
          highestRiskLevel: experimentsTable.highestRiskLevel,
          status: experimentsTable.status,
          lastSavedDate: experimentsTable.lastSavedDate,
          submissionDate: experimentsTable.submissionDate,
          submittedUserId: sql<number>`${experimentsTable.submittedUserId}`,
          submittedUserName: sql<string>`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`,
          placeTagId: experimentsTable.placeTagId,
          placeName: laboratoriesTable.name,
          placeAddress: laboratoriesTable.address,
          centreId: laboratoriesTable.centreId,
          isPlaceDeleted: laboratoriesTable.isDeleted,
          experimentEndDate: experimentsTable.experimentEndDate,
          firstApproverId: experimentsTable.firstApproverId,
          firstApproverName: sql`CONCAT(${supervisorTable.firstName}, ' ', ${supervisorTable.lastName})`,
          firstApprovalTime: experimentsTable.firstApprovalTime,
          firstApproverComments: experimentsTable.firstApproverComments,
          secondApproverId: experimentsTable.secondApproverId,
          secondApproverName: sql`CONCAT(${approverTable.firstName}, ' ', ${approverTable.lastName})`,
          secondApprovalTime: experimentsTable.secondApprovalTime,
          secondApproverComments: experimentsTable.secondApproverComments,
          stockControlId: experimentsTable.stockControlId,
          stockControlName: sql`CONCAT(${stockPersonTable.firstName}, ' ', ${stockPersonTable.lastName})`,
          stockControlCheckedTime: experimentsTable.stockControlCheckedTime,
          stockControlComments: experimentsTable.stockControlComments,
        })
        .from(experimentsTable)
        .innerJoin(usersTable, eq(experimentsTable.submittedUserId, usersTable.userId))
        .innerJoin(laboratoriesTable, eq(experimentsTable.placeTagId, laboratoriesTable.id))
        .leftJoin(supervisorTable, eq(supervisorTable.userId, experimentsTable.firstApproverId))
        .leftJoin(approverTable, eq(approverTable.userId, experimentsTable.secondApproverId))
        .leftJoin(stockPersonTable, eq(stockPersonTable.userId, experimentsTable.stockControlId))
        .where(eq(experimentsTable.status, "escalated"))
        .orderBy(desc(experimentsTable.submissionDate));
    } else if (userRole === "storage") {
      pendingRequests = await database
        .select({
          experimentId: experimentsTable.experimentId,
          experimentDetails: experimentsTable.experimentDetails,
          isRiskAssessmentDone: experimentsTable.isRiskAssessmentDone,
          highestRiskLevel: experimentsTable.highestRiskLevel,
          status: experimentsTable.status,
          lastSavedDate: experimentsTable.lastSavedDate,
          submissionDate: experimentsTable.submissionDate,
          submittedUserId: sql<number>`${experimentsTable.submittedUserId}`,
          submittedUserName: sql<string>`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`,
          placeTagId: experimentsTable.placeTagId,
          placeName: laboratoriesTable.name,
          placeAddress: laboratoriesTable.address,
          centreId: laboratoriesTable.centreId,
          isPlaceDeleted: laboratoriesTable.isDeleted,
          experimentEndDate: experimentsTable.experimentEndDate,
          firstApproverId: experimentsTable.firstApproverId,
          firstApproverName: sql`CONCAT(${supervisorTable.firstName}, ' ', ${supervisorTable.lastName})`,
          firstApprovalTime: experimentsTable.firstApprovalTime,
          firstApproverComments: experimentsTable.firstApproverComments,
          secondApproverId: experimentsTable.secondApproverId,
          secondApproverName: sql`CONCAT(${approverTable.firstName}, ' ', ${approverTable.lastName})`,
          secondApprovalTime: experimentsTable.secondApprovalTime,
          secondApproverComments: experimentsTable.secondApproverComments,
          stockControlId: experimentsTable.stockControlId,
          stockControlName: sql`CONCAT(${stockPersonTable.firstName}, ' ', ${stockPersonTable.lastName})`,
          stockControlCheckedTime: experimentsTable.stockControlCheckedTime,
          stockControlComments: experimentsTable.stockControlComments,
        })
        .from(experimentsTable)
        .innerJoin(usersTable, eq(experimentsTable.submittedUserId, usersTable.userId))
        .innerJoin(laboratoriesTable, eq(experimentsTable.placeTagId, laboratoriesTable.id))
        .leftJoin(supervisorTable, eq(supervisorTable.userId, experimentsTable.firstApproverId))
        .leftJoin(approverTable, eq(approverTable.userId, experimentsTable.secondApproverId))
        .leftJoin(stockPersonTable, eq(stockPersonTable.userId, experimentsTable.stockControlId))
        .where(eq(experimentsTable.status, "approved"))
        .orderBy(desc(experimentsTable.submissionDate));
    }
    if (!pendingRequests)
      throw new DatabaseError("Unable to get the pending requests due to system errors. Please try again.");
    if (pendingRequests?.length === 0) {
      res.success = true;
      res.data = [];
      res.message = "No pending requests found!";
    } else {
      res.success = true;
      res.data = pendingRequests;
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

export async function getPreviousRequests() {
  const signedUser = await getSignedUser();
  if (!signedUser) throw new ThrowableError("Please sign in before proceeding.");
  if (signedUser?.role === "admin")
    throw new ThrowableError("Sorry, you don't have permission to access this sort of data.");

  return cachedGetPreviousRequests(parseInt(signedUser.id), signedUser?.role);
}

const cachedGetPreviousRequests = async (userId: number, userRole: string) => {
  let res: DTOResponse<Array<Experiment>> = {
    success: false,
    data: [],
    message: "",
  };
  try {
    let result;
    const supervisorTable = aliasedTable(usersTable, "supervisorTable");
    const approverTable = aliasedTable(usersTable, "approverTable");
    const stockPersonTable = aliasedTable(usersTable, "stockPersonTable");
    if (userRole === "researcher") {
      result = await database
        .select({
          experimentId: experimentsTable.experimentId,
          experimentDetails: experimentsTable.experimentDetails,
          isRiskAssessmentDone: experimentsTable.isRiskAssessmentDone,
          highestRiskLevel: experimentsTable.highestRiskLevel,
          status: experimentsTable.status,
          lastSavedDate: experimentsTable.lastSavedDate,
          submissionDate: experimentsTable.submissionDate,
          submittedUserId: sql<number>`${experimentsTable.submittedUserId}`,
          submittedUserName: sql`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`,
          placeTagId: experimentsTable.placeTagId,
          placeName: laboratoriesTable.name,
          placeAddress: laboratoriesTable.address,
          centreId: laboratoriesTable.centreId,
          isPlaceDeleted: laboratoriesTable.isDeleted,
          experimentEndDate: experimentsTable.experimentEndDate,
          firstApproverId: experimentsTable.firstApproverId,
          firstApproverName: sql`CONCAT(${supervisorTable.firstName}, ' ', ${supervisorTable.lastName})`,
          firstApprovalTime: experimentsTable.firstApprovalTime,
          firstApproverComments: experimentsTable.firstApproverComments,
          secondApproverId: experimentsTable.secondApproverId,
          secondApproverName: sql`CONCAT(${approverTable.firstName}, ' ', ${approverTable.lastName})`,
          secondApprovalTime: experimentsTable.secondApprovalTime,
          secondApproverComments: experimentsTable.secondApproverComments,
          stockControlId: experimentsTable.stockControlId,
          stockControlName: sql`CONCAT(${stockPersonTable.firstName}, ' ', ${stockPersonTable.lastName})`,
          stockControlCheckedTime: experimentsTable.stockControlCheckedTime,
          stockControlComments: experimentsTable.stockControlComments,
        })
        .from(experimentsTable)
        .innerJoin(usersTable, eq(experimentsTable.submittedUserId, usersTable.userId))
        .innerJoin(laboratoriesTable, eq(experimentsTable.placeTagId, laboratoriesTable.id))
        .leftJoin(supervisorTable, eq(supervisorTable.userId, experimentsTable.firstApproverId))
        .leftJoin(approverTable, eq(approverTable.userId, experimentsTable.secondApproverId))
        .leftJoin(stockPersonTable, eq(stockPersonTable.userId, experimentsTable.stockControlId))
        .where(eq(experimentsTable.submittedUserId, userId))
        .orderBy(desc(experimentsTable.submissionDate));
    } else if (userRole === "supervisor") {
      result = await database
        .select({
          experimentId: experimentsTable.experimentId,
          experimentDetails: experimentsTable.experimentDetails,
          isRiskAssessmentDone: experimentsTable.isRiskAssessmentDone,
          highestRiskLevel: experimentsTable.highestRiskLevel,
          status: experimentsTable.status,
          lastSavedDate: experimentsTable.lastSavedDate,
          submissionDate: experimentsTable.submissionDate,
          submittedUserId: sql<number>`${experimentsTable.submittedUserId}`,
          submittedUserName: sql`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`,
          placeTagId: experimentsTable.placeTagId,
          placeName: laboratoriesTable.name,
          placeAddress: laboratoriesTable.address,
          centreId: laboratoriesTable.centreId,
          isPlaceDeleted: laboratoriesTable.isDeleted,
          experimentEndDate: experimentsTable.experimentEndDate,
          firstApproverId: experimentsTable.firstApproverId,
          firstApproverName: sql`CONCAT(${supervisorTable.firstName}, ' ', ${supervisorTable.lastName})`,
          firstApprovalTime: experimentsTable.firstApprovalTime,
          firstApproverComments: experimentsTable.firstApproverComments,
          secondApproverId: experimentsTable.secondApproverId,
          secondApproverName: sql`CONCAT(${approverTable.firstName}, ' ', ${approverTable.lastName})`,
          secondApprovalTime: experimentsTable.secondApprovalTime,
          secondApproverComments: experimentsTable.secondApproverComments,
          stockControlId: experimentsTable.stockControlId,
          stockControlName: sql`CONCAT(${stockPersonTable.firstName}, ' ', ${stockPersonTable.lastName})`,
          stockControlCheckedTime: experimentsTable.stockControlCheckedTime,
          stockControlComments: experimentsTable.stockControlComments,
        })
        .from(experimentsTable)
        .innerJoin(usersTable, eq(experimentsTable.submittedUserId, usersTable.userId))
        .innerJoin(laboratoriesTable, eq(experimentsTable.placeTagId, laboratoriesTable.id))
        .leftJoin(supervisorTable, eq(supervisorTable.userId, experimentsTable.firstApproverId))
        .leftJoin(approverTable, eq(approverTable.userId, experimentsTable.secondApproverId))
        .leftJoin(stockPersonTable, eq(stockPersonTable.userId, experimentsTable.stockControlId))
        .where(eq(experimentsTable.firstApproverId, userId))
        .orderBy(desc(experimentsTable.submissionDate));
    } else if (userRole === "approver") {
      result = await database
        .select({
          experimentId: experimentsTable.experimentId,
          experimentDetails: experimentsTable.experimentDetails,
          isRiskAssessmentDone: experimentsTable.isRiskAssessmentDone,
          highestRiskLevel: experimentsTable.highestRiskLevel,
          status: experimentsTable.status,
          lastSavedDate: experimentsTable.lastSavedDate,
          submissionDate: experimentsTable.submissionDate,
          submittedUserId: sql<number>`${experimentsTable.submittedUserId}`,
          submittedUserName: sql`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`,
          placeTagId: experimentsTable.placeTagId,
          placeName: laboratoriesTable.name,
          placeAddress: laboratoriesTable.address,
          centreId: laboratoriesTable.centreId,
          isPlaceDeleted: laboratoriesTable.isDeleted,
          experimentEndDate: experimentsTable.experimentEndDate,
          firstApproverId: experimentsTable.firstApproverId,
          firstApproverName: sql`CONCAT(${supervisorTable.firstName}, ' ', ${supervisorTable.lastName})`,
          firstApprovalTime: experimentsTable.firstApprovalTime,
          firstApproverComments: experimentsTable.firstApproverComments,
          secondApproverId: experimentsTable.secondApproverId,
          secondApproverName: sql`CONCAT(${approverTable.firstName}, ' ', ${approverTable.lastName})`,
          secondApprovalTime: experimentsTable.secondApprovalTime,
          secondApproverComments: experimentsTable.secondApproverComments,
          stockControlId: experimentsTable.stockControlId,
          stockControlName: sql`CONCAT(${stockPersonTable.firstName}, ' ', ${stockPersonTable.lastName})`,
          stockControlCheckedTime: experimentsTable.stockControlCheckedTime,
          stockControlComments: experimentsTable.stockControlComments,
        })
        .from(experimentsTable)
        .innerJoin(usersTable, eq(experimentsTable.submittedUserId, usersTable.userId))
        .innerJoin(laboratoriesTable, eq(experimentsTable.placeTagId, laboratoriesTable.id))
        .leftJoin(supervisorTable, eq(supervisorTable.userId, experimentsTable.firstApproverId))
        .leftJoin(approverTable, eq(approverTable.userId, experimentsTable.secondApproverId))
        .leftJoin(stockPersonTable, eq(stockPersonTable.userId, experimentsTable.stockControlId))
        .where(eq(experimentsTable.secondApproverId, userId))
        .orderBy(desc(experimentsTable.submissionDate));
    } else if (userRole === "storage") {
      result = await database
        .select({
          experimentId: experimentsTable.experimentId,
          experimentDetails: experimentsTable.experimentDetails,
          isRiskAssessmentDone: experimentsTable.isRiskAssessmentDone,
          highestRiskLevel: experimentsTable.highestRiskLevel,
          status: experimentsTable.status,
          lastSavedDate: experimentsTable.lastSavedDate,
          submissionDate: experimentsTable.submissionDate,
          submittedUserId: sql<number>`${experimentsTable.submittedUserId}`,
          submittedUserName: sql`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`,
          placeTagId: experimentsTable.placeTagId,
          placeName: laboratoriesTable.name,
          placeAddress: laboratoriesTable.address,
          centreId: laboratoriesTable.centreId,
          isPlaceDeleted: laboratoriesTable.isDeleted,
          experimentEndDate: experimentsTable.experimentEndDate,
          firstApproverId: experimentsTable.firstApproverId,
          firstApproverName: sql`CONCAT(${supervisorTable.firstName}, ' ', ${supervisorTable.lastName})`,
          firstApprovalTime: experimentsTable.firstApprovalTime,
          firstApproverComments: experimentsTable.firstApproverComments,
          secondApproverId: experimentsTable.secondApproverId,
          secondApproverName: sql`CONCAT(${approverTable.firstName}, ' ', ${approverTable.lastName})`,
          secondApprovalTime: experimentsTable.secondApprovalTime,
          secondApproverComments: experimentsTable.secondApproverComments,
          stockControlId: experimentsTable.stockControlId,
          stockControlName: sql`CONCAT(${stockPersonTable.firstName}, ' ', ${stockPersonTable.lastName})`,
          stockControlCheckedTime: experimentsTable.stockControlCheckedTime,
          stockControlComments: experimentsTable.stockControlComments,
        })
        .from(experimentsTable)
        .innerJoin(usersTable, eq(experimentsTable.submittedUserId, usersTable.userId))
        .innerJoin(laboratoriesTable, eq(experimentsTable.placeTagId, laboratoriesTable.id))
        .leftJoin(supervisorTable, eq(supervisorTable.userId, experimentsTable.firstApproverId))
        .leftJoin(approverTable, eq(approverTable.userId, experimentsTable.secondApproverId))
        .leftJoin(stockPersonTable, eq(stockPersonTable.userId, experimentsTable.stockControlId))
        .where(eq(experimentsTable.stockControlId, userId))
        .orderBy(desc(experimentsTable.submissionDate));
    }

    if (!result) throw new DatabaseError("Failed to retrieve the previous requests. Please try again.");
    if (result?.length === 0) {
      res.success = true;
      res.data = [];
      res.message = "No previous requests found!";
    } else {
      res.success = true;
      res.data = result;
    }
  } catch (error: any) {
    res.message = "Something went wrong with the database query. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }
  return res;
};

export const getRequestById = async (experimentId: number) => {
  let res: DTOResponse<ExperimentDetails | null> = {
    success: false,
    data: null,
    message: "",
  };

  try {
    const supervisorTable = aliasedTable(usersTable, "supervisorTable");
    const approverTable = aliasedTable(usersTable, "approverTable");
    const stockPersonTable = aliasedTable(usersTable, "stockPersonTable");

    const experiment = await database
      .select({
        experimentId: experimentsTable.experimentId,
        experimentDetails: experimentsTable.experimentDetails,
        isRiskAssessmentDone: experimentsTable.isRiskAssessmentDone,
        highestRiskLevel: experimentsTable.highestRiskLevel,
        status: experimentsTable.status,
        lastSavedDate: experimentsTable.lastSavedDate,
        submissionDate: experimentsTable.submissionDate,
        submittedUserId: experimentsTable.submittedUserId,
        submittedUserName: sql<string>`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`,
        placeTagId: experimentsTable.placeTagId,
        placeName: laboratoriesTable.name,
        placeAddress: laboratoriesTable.address,
        centreId: laboratoriesTable.centreId,
        isPlaceDeleted: laboratoriesTable.isDeleted,
        experimentEndDate: experimentsTable.experimentEndDate,
        firstApproverId: experimentsTable.firstApproverId,
        firstApproverName: sql<string>`CONCAT(${supervisorTable.firstName}, ' ', ${supervisorTable.lastName})`,
        firstApprovalTime: experimentsTable.firstApprovalTime,
        firstApproverComments: experimentsTable.firstApproverComments,
        secondApproverId: experimentsTable.secondApproverId,
        secondApproverName: sql<string>`CONCAT(${approverTable.firstName}, ' ', ${approverTable.lastName})`,
        secondApprovalTime: experimentsTable.secondApprovalTime,
        secondApproverComments: experimentsTable.secondApproverComments,
        stockControlId: experimentsTable.stockControlId,
        stockControlName: sql<string>`CONCAT(${stockPersonTable.firstName}, ' ', ${stockPersonTable.lastName})`,
        stockControlCheckedTime: experimentsTable.stockControlCheckedTime,
        stockControlComments: experimentsTable.stockControlComments,
      })
      .from(experimentsTable)
      .innerJoin(usersTable, eq(experimentsTable.submittedUserId, usersTable.userId))
      .innerJoin(laboratoriesTable, eq(experimentsTable.placeTagId, laboratoriesTable.id))
      .leftJoin(supervisorTable, eq(experimentsTable.firstApproverId, supervisorTable.userId))
      .leftJoin(approverTable, eq(experimentsTable.secondApproverId, approverTable.userId))
      .leftJoin(stockPersonTable, eq(experimentsTable.stockControlId, stockPersonTable.userId))
      .where(eq(experimentsTable.experimentId, experimentId))
      .limit(1);

    if (!experiment) throw new DatabaseError("Failed to retrieve the request details. Please try again.");
    if (experiment.length === 0) {
      throw new ThrowableError("Experiment not found");
    }
    const experimentDetails = experiment[0];

    const chemicals = await database
      .select({
        id: chemicalAssigningTable.id,
        experimentId: sql<number>`${chemicalAssigningTable.experimentId}`,
        chemicalId: sql<number>`${chemicalAssigningTable.chemicalId}`,
        commonName: chemicalDataTable.commonName,
        systematicName: chemicalDataTable.systematicName,
        stockId: chemicalAssigningTable.stockId,
        pickupStorage: sql<string>`${storageLocationsTable.storageName}`,
        placeName: sql<string>`COALESCE(${institutesTable.name}, ${researchCentresTable.name}, ${laboratoriesTable.name})`,
        quantity: chemicalAssigningTable.quantity,
        riskLevel: chemicalDataTable.riskLevel,
      })
      .from(chemicalAssigningTable)
      .innerJoin(chemicalDataTable, eq(chemicalAssigningTable.chemicalId, chemicalDataTable.chemicalId))
      .leftJoin(stockTable, eq(chemicalAssigningTable.stockId, stockTable.stockId))
      .leftJoin(storageLocationsTable, eq(stockTable.storageId, storageLocationsTable.storageId))
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
      .where(eq(chemicalAssigningTable.experimentId, experimentId))
      .orderBy(asc(chemicalAssigningTable.id));

    if (!chemicals) throw new DatabaseError("Unable to retrieve requested chemicals. Please try again.");
    if (chemicals?.length === 0) {
      res.success = true;
      res.data = null;
      res.message = "No request found!";
    } else {
      res.success = true;
      res.data = {
        experimentDetails,
        chemicalList: chemicals,
      };
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
export const approveOrRejectRequest = async (params: {
  experimentId: number;
  status: (typeof experimentStatusEnum.enumValues)[number];
  comments?: string | "";
  assignedPickUpStorage?: Array<ChemicalAssigningType>;
}) => {
  let res: DTOResponse<{ id: number }> = {
    success: false,
    data: { id: -1 },
    message: "",
  };
  console.log("approve or reject", params);
  try {
    const signedUser = await getSignedUser();
    if (!signedUser) throw new ThrowableError("Please sign in before proceeding.");
    if (!["supervisor", "approver", "storage"].includes(signedUser.role)) {
      throw new ThrowableError("Sorry, you don't have permission to authorize any requests.");
    }
    if (!params.experimentId) throw new ThrowableError("Please provide the experiment id.");
    if (!params.status) throw new ThrowableError("Please provide the status.");
    if (signedUser?.role === "storage" && params.status == "procured") {
      if (!params.assignedPickUpStorage || params.assignedPickUpStorage?.length === 0) {
        throw new ThrowableError("Please provide the assigned pick-up storage location.");
      }
      params.assignedPickUpStorage.forEach((item) => {
        if (item.stockId == null || item.stockId == undefined) {
          throw new ThrowableError("Please assign valid pick-up storage locations.");
        }
      });
    }

    const experiment = await database
      .select()
      .from(experimentsTable)
      .where(eq(experimentsTable.experimentId, params.experimentId))
      .limit(1);
    if (!experiment || experiment?.length === 0) {
      throw new DatabaseError(
        "Unable to access the existing record due to database query issue. Please recheck your details and try again.",
      );
    }

    const currentStatus = experiment[0].status;
    console.log("ex_details", experiment[0].status);

    if (
      (signedUser?.role === "supervisor" && currentStatus !== "submitted") ||
      (signedUser?.role === "approver" && currentStatus !== "escalated") ||
      (signedUser?.role === "storage" && currentStatus !== "approved")
    ) {
      throw new ThrowableError("Experiment cannot be approved or rejected in its current state");
    }

    let updateData: Partial<typeof experimentsTable.$inferInsert> = {};
    switch (signedUser.role) {
      case "supervisor":
        if (!["approved", "escalated", "rejected"].includes(params.status)) {
          throw new ThrowableError("Please provide valid status.");
        }
        updateData = {
          firstApproverId: parseInt(signedUser.id),
          firstApproverComments: params.comments,
        };
        break;
      case "approver":
        if (!["approved", "rejected"].includes(params.status)) {
          throw new ThrowableError("Please provide valid status.");
        }
        updateData = {
          secondApproverId: parseInt(signedUser.id),
          secondApproverComments: params.comments,
        };
        break;
      case "storage":
        console.log("storage switch");
        if (!["procured", "rejected"].includes(params.status)) {
          throw new ThrowableError("Please provide valid status.");
        }
        updateData = {
          stockControlId: parseInt(signedUser.id),
          stockControlComments: params.comments ? params.comments : "",
        };
        break;
    }
    console.log("status", params.status);
    console.log("updateData", updateData);

    let updateResult;
    if (signedUser.role === "supervisor") {
      updateResult = await database
        .update(experimentsTable)
        .set({ ...updateData, status: params.status, firstApprovalTime: sql`NOW()` })
        .where(eq(experimentsTable.experimentId, params.experimentId))
        .returning({ experimentId: experimentsTable.experimentId });
    } else if (signedUser.role === "approver") {
      updateResult = await database
        .update(experimentsTable)
        .set({ ...updateData, status: params.status, secondApprovalTime: sql`NOW()` })
        .where(eq(experimentsTable.experimentId, params.experimentId))
        .returning({ experimentId: experimentsTable.experimentId });
    } else if (signedUser.role === "storage") {
      updateResult = await database
        .update(experimentsTable)
        .set({ ...updateData, status: params.status, stockControlCheckedTime: sql`NOW()` })
        .where(eq(experimentsTable.experimentId, params.experimentId))
        .returning({ experimentId: experimentsTable.experimentId });
    }

    console.log("updateResult", updateResult);
    if (!updateResult || updateResult?.length === 0) {
      throw new DatabaseError("Unable to update the experiment status. Please try again.");
    }

    //update the assigned stock id for each requested chemical.
    if (signedUser?.role === "storage" && params.status === "procured") {
      await Promise.all(
        params.assignedPickUpStorage!.map(async (assignedStorage) => {
          const assignedResult = await database
            .update(chemicalAssigningTable)
            .set({ stockId: assignedStorage.stockId })
            .where(
              and(
                eq(chemicalAssigningTable.experimentId, params.experimentId),
                eq(chemicalAssigningTable.chemicalId, assignedStorage.chemicalId),
              ),
            )
            .returning({ updatedId: chemicalAssigningTable.stockId });

          console.log("Assigning Result", assignedResult);

          const stockData = await database
            .select()
            .from(stockTable)
            .where(sql`${stockTable.stockId} = ${assignedStorage.stockId}`)
            .limit(1);

          console.log("Chosen Stock", stockData);
          if (!stockData || stockData.length === 0) {
            throw new DatabaseError(`Stock not found for ID: ${assignedStorage.stockId}`);
          }

          const currentStock = stockData[0];

          console.log("Current Stock: ", currentStock);
          if (currentStock.quantity < assignedStorage.quantity) {
            throw new ThrowableError(`Insufficient stock for chemical ID: ${currentStock.chemicalId}`);
          }

          const remainingQty = currentStock.quantity - assignedStorage.quantity;

          const updatedStock = await database
            .update(stockTable)
            .set({
              quantity: assignedStorage.quantity,
              lastUpdatedBy: parseInt(signedUser.id),
              lastUpdatedTime: sql`NOW()`,
              isOccupied: true,
            })
            .where(sql`${stockTable.stockId} = ${assignedStorage.stockId}`)
            .returning({ updatedId: stockTable.stockId });

          console.log("Updated Stock: ", updatedStock);
          console.log("Reminding QTY: ", remainingQty);

          if (remainingQty === 0) return;

          if (remainingQty > 0) {
            const newStock = await database
              .insert(stockTable)
              .values({
                storageId: currentStock.storageId,
                chemicalId: currentStock.chemicalId,
                quantity: remainingQty,
                expiryDate: currentStock.expiryDate,
                lastUpdatedBy: parseInt(signedUser.id),
                lastUpdatedTime: sql`NOW()`,
                isOccupied: false,
              })
              .returning({ insertedId: stockTable.stockId });
            console.log("Split new Stock: ", newStock);
          }
        }),
      );
    }
    return {
      success: true,
      data: { id: updateResult[0].experimentId },
      message: "The request status is updated successfully.",
    };
  } catch (error: any) {
    console.log(error);
    res.message = "Something went wrong with database query. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }

  return res;
};

export const getAllRequestsDetailsC = async (): Promise<DTOResponse<ExperimentDetailsWithLab[] | null>> => {
  let res: DTOResponse<ExperimentDetailsWithLab[] | null> = {
    success: false,
    data: null,
    message: "",
  };

  try {
    const startTime = performance.now();
    const supervisorTable = aliasedTable(usersTable, "supervisorTable");
    const approverTable = aliasedTable(usersTable, "approverTable");
    const stockPersonTable = aliasedTable(usersTable, "stockPersonTable");

    const experiments = (await database
      .select({
        experimentId: experimentsTable.experimentId,
        experimentDetails: experimentsTable.experimentDetails,
        isRiskAssessmentDone: experimentsTable.isRiskAssessmentDone,
        highestRiskLevel: experimentsTable.highestRiskLevel,
        status: experimentsTable.status,
        lastSavedDate: experimentsTable.lastSavedDate,
        submissionDate: experimentsTable.submissionDate,
        submittedUserId: experimentsTable.submittedUserId,
        submittedUserName: sql<string>`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`,
        placeTagId: experimentsTable.placeTagId,
        placeName: laboratoriesTable.name,
        placeAddress: laboratoriesTable.address,
        centreId: laboratoriesTable.centreId,
        isPlaceDeleted: laboratoriesTable.isDeleted,
        experimentEndDate: experimentsTable.experimentEndDate,
        firstApproverId: experimentsTable.firstApproverId,
        firstApproverName: sql<string>`CONCAT(${supervisorTable.firstName}, ' ', ${supervisorTable.lastName})`,
        firstApprovalTime: experimentsTable.firstApprovalTime,
        firstApproverComments: experimentsTable.firstApproverComments,
        secondApproverId: experimentsTable.secondApproverId,
        secondApproverName: sql<string>`CONCAT(${approverTable.firstName}, ' ', ${approverTable.lastName})`,
        secondApprovalTime: experimentsTable.secondApprovalTime,
        secondApproverComments: experimentsTable.secondApproverComments,
        stockControlId: experimentsTable.stockControlId,
        stockControlName: sql<string>`CONCAT(${stockPersonTable.firstName}, ' ', ${stockPersonTable.lastName})`,
        stockControlCheckedTime: experimentsTable.stockControlCheckedTime,
        stockControlComments: experimentsTable.stockControlComments,
      })
      .from(experimentsTable)
      .innerJoin(usersTable, eq(experimentsTable.submittedUserId, usersTable.userId))
      .innerJoin(laboratoriesTable, eq(experimentsTable.placeTagId, laboratoriesTable.id))
      .leftJoin(supervisorTable, eq(experimentsTable.firstApproverId, supervisorTable.userId))
      .leftJoin(approverTable, eq(experimentsTable.secondApproverId, approverTable.userId))
      .leftJoin(stockPersonTable, eq(experimentsTable.stockControlId, stockPersonTable.userId))
      .orderBy(desc(experimentsTable.submissionDate))) as ExperimentWithName[];

    if (!experiments) throw new DatabaseError("Failed to retrieve the experiments. Please try again.");

    // Fetch all labs
    const labsResponse = await getLabs();
    if (!labsResponse.success || !labsResponse.data) {
      throw new Error("Failed to retrieve lab information");
    }
    const labs = labsResponse.data;

    const experimentDetails: ExperimentDetailsWithLab[] = await Promise.all(
      experiments.map(async (experiment) => {
        const chemicals = await database
          .select({
            id: chemicalAssigningTable.id,
            experimentId: sql<number>`${chemicalAssigningTable.experimentId}`,
            chemicalId: sql<number>`${chemicalAssigningTable.chemicalId}`,
            commonName: chemicalDataTable.commonName,
            systematicName: chemicalDataTable.systematicName,
            stockId: chemicalAssigningTable.stockId,
            pickupStorage: sql<string>`${storageLocationsTable.storageName}`,
            placeName: sql<string>`COALESCE(${institutesTable.name}, ${researchCentresTable.name}, ${laboratoriesTable.name})`,
            quantity: chemicalAssigningTable.quantity,
            riskLevel: chemicalDataTable.riskLevel,
          })
          .from(chemicalAssigningTable)
          .innerJoin(chemicalDataTable, eq(chemicalAssigningTable.chemicalId, chemicalDataTable.chemicalId))
          .leftJoin(stockTable, eq(chemicalAssigningTable.stockId, stockTable.stockId))
          .leftJoin(storageLocationsTable, eq(stockTable.storageId, storageLocationsTable.storageId))
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
          .where(eq(chemicalAssigningTable.experimentId, experiment.experimentId))
          .orderBy(asc(chemicalAssigningTable.id));

        // Find the matching lab based on placeTagId
        const lab = labs.find((lab) => lab.id === experiment.placeTagId);

        return {
          experimentDetails: experiment,
          chemicalList: chemicals,
          lab: lab || null,
        };
      }),
    );
    const endTime = performance.now();
    console.log(`getAllRequestsDetailsC Execution time: ${endTime - startTime} milliseconds`);

    res.success = true;
    res.data = experimentDetails;
  } catch (error: any) {
    console.error(error);
    res.message = "Something went wrong with the database query. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }

  return res;
};

export const getRequestsDetailsByUserC = async (
  user: LoginUser,
): Promise<DTOResponse<ExperimentDetailsWithLab[] | null>> => {
  let res: DTOResponse<ExperimentDetailsWithLab[] | null> = {
    success: false,
    data: null,
    message: "",
  };

  try {
    const startTime = performance.now();

    const allRequests = await getAllRequestsDetailsC();

    if (!allRequests.success || !allRequests.data) {
      throw new Error(allRequests.message || "Failed to retrieve all requests");
    }

    const userId = parseInt(user.id);
    let filteredRequests: ExperimentDetailsWithLab[];
    const [{ placeTagId }] = await database
      .select({
        placeTagId: usersTable.placeTagId,
      })
      .from(usersTable)
      .where(eq(usersTable.userId, userId))
      .limit(1);

    switch (user.role) {
      case "researcher":
        filteredRequests = allRequests.data.filter((request) => request.experimentDetails.submittedUserId === userId);
        break;
      case "supervisor":
        filteredRequests = allRequests.data.filter(
          (request) =>
            request.experimentDetails.firstApproverId === userId ||
            (request.experimentDetails.status === "submitted" && request.lab?.centreId === placeTagId),
        );
        break;
      case "approver":
        filteredRequests = allRequests.data.filter(
          (request) =>
            request.experimentDetails.secondApproverId === userId || request.experimentDetails.status === "escalated",
        );
        break;
      case "storage":
        filteredRequests = allRequests.data.filter(
          (request) =>
            request.experimentDetails.stockControlId === userId || request.experimentDetails.status === "approved",
        );
        break;
      default:
        throw new ThrowableError("Invalid user role");
    }

    res.success = true;
    res.data = filteredRequests;
    if (filteredRequests.length === 0) {
      res.message = "No requests found for this user.";
    }

    const endTime = performance.now();
    console.log(`getAllRequestsDetailsC ${user.fullName} Execution time: ${endTime - startTime} milliseconds`);
  } catch (error: any) {
    console.error(error);
    res.message = "Something went wrong while retrieving user-specific requests. Please try again.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }

  return res;
};

export const getApprovedToUseChemicals = async () => {
  let res: DTOResponse<Array<ChemicalStock>> = {
    success: false,
    data: [],
    message: "",
  };
  try {
    const signedUser = await getSignedUser();
    if (!signedUser) throw new ThrowableError("Please sign in before proceeding.");
    if (signedUser?.role !== "researcher") {
      throw new ThrowableError("Sorry, you don't have permission to access this sort of data.");
    }

    const result = await database
      .select({
        experimentId: experimentsTable.experimentId,
        chemicalId: sql<number>`${chemicalAssigningTable.chemicalId}`,
        commonName: chemicalDataTable.commonName,
        systematicName: chemicalDataTable.systematicName,
        highestRiskLevel: experimentsTable.highestRiskLevel,
        status: experimentsTable.status,
        lastSavedDate: experimentsTable.lastSavedDate,
        submissionDate: experimentsTable.submissionDate,
        submittedUserId: sql<number>`${experimentsTable.submittedUserId}`,
        submittedUserName: sql`CONCAT(${usersTable.firstName}, ' ', ${usersTable.lastName})`,
        placeTagId: experimentsTable.placeTagId,
        placeName: laboratoriesTable.name,
        experimentEndDate: experimentsTable.experimentEndDate,
        stockId: sql<number>`${chemicalAssigningTable.stockId}`,
        storageId: sql<number>`${stockTable.storageId}`,
        storageName: storageLocationsTable.storageName,
        quantity: chemicalAssigningTable.quantity,
        expiryDate: stockTable.expiryDate,
        disposalChemicalId: disposalLogsTable.chemicalId,
        disposalStockId: disposalLogsTable.stockId,
        isDisposed: sql<boolean>`CASE WHEN ${disposalLogsTable.chemicalId} IS NOT NULL AND ${disposalLogsTable.stockId} IS NOT NULL THEN true ELSE false END`,
      })
      .from(experimentsTable)
      .innerJoin(usersTable, eq(experimentsTable.submittedUserId, usersTable.userId))
      .innerJoin(chemicalAssigningTable, eq(experimentsTable.experimentId, chemicalAssigningTable.experimentId))
      .innerJoin(stockTable, eq(chemicalAssigningTable.stockId, stockTable.stockId))
      .innerJoin(storageLocationsTable, eq(stockTable.storageId, storageLocationsTable.storageId))
      .innerJoin(chemicalDataTable, eq(chemicalAssigningTable.chemicalId, chemicalDataTable.chemicalId))
      .innerJoin(laboratoriesTable, eq(experimentsTable.placeTagId, laboratoriesTable.id))
      .leftJoin(
        disposalLogsTable,
        and(
          eq(chemicalAssigningTable.stockId, disposalLogsTable.stockId),
          eq(chemicalAssigningTable.chemicalId, disposalLogsTable.chemicalId),
        ),
      )
      .where(
        and(
          eq(experimentsTable.submittedUserId, sql`${parseInt(signedUser.id)}`),
          eq(experimentsTable.status, "procured"),
        ),
      )
      .orderBy(desc(experimentsTable.submissionDate));
    if (!result) throw new DatabaseError("Failed to retrieve your previous requested chemicals. Please try again.");
    if (result?.length === 0) {
      res.success = true;
      res.data = [];
      res.message = "No previous requests found!";
    } else {
      res.success = true;
      res.data = result;
    }
  } catch (error: any) {
    console.log(error);
    res.message = "Something went wrong with the database query. Please try again later.";
    if (error instanceof DatabaseError || error instanceof ThrowableError) {
      res.message = error.message;
    }
  }
  return res;
};
