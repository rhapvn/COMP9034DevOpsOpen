"use server";
import {
  getUsers,
  getUserById,
  addUser,
  updateUserDetails,
  updateUserPersonalDetails,
  updateUserStatus,
} from "@/db/api/userService";
import {
  getInstitutes,
  addInstitute,
  updateInstitute,
  removeInstitute,
  getInstituteById,
} from "@/db/api/instituteService";
import {
  getResearchCentres,
  addResearchCentre,
  updateResearchCentre,
  removeResearchCentre,
  getResearchCentreById,
} from "@/db/api/researchCentreService";
import { getLabs, addLab, updateLab, removeLab, getLabById } from "@/db/api/labService";
import { getStorages, addStorage, updateStorage, removeStorage, getStorageById } from "@/db/api/storageService";
import {
  getChemicalData,
  addChemicalData,
  updateChemicalData,
  removeChemicalData,
  getChemicalDataById,
} from "@/db/api/chemicalDataService";

import { getAdminStatistics } from "@/db/api/adminDashboardStatistics";
import { getRSAStatistics } from "@/db/api/RSADashboardStatistics";
import {
  addExperiment,
  getPendingRequests,
  getPreviousRequests,
  getRequestById,
  approveOrRejectRequest,
  getRequestsDetailsByUserC,
  getApprovedToUseChemicals,
} from "@/db/api/experimentService";

import {
  getChemicalStock,
  getAvailableChemicalsInStockC,
  updateChemicalQuantity,
  disposeChemical,
  recordChemical,
  getChemicalListByStorageId,
  getChemicalDisposalByStorageId,
  getStockTakeListByStorageId,
  getAvailableChemicalsInStock,
} from "@/db/api/stockService";

import { getStorageStatistics } from "@/db/api/storageDashboardStatistics";

export {
  getUsers,
  getUserById,
  addUser,
  updateUserDetails,
  updateUserPersonalDetails,
  updateUserStatus,
  getInstitutes,
  addInstitute,
  updateInstitute,
  removeInstitute,
  getInstituteById,
  getResearchCentres,
  addResearchCentre,
  updateResearchCentre,
  removeResearchCentre,
  getResearchCentreById,
  getLabs,
  addLab,
  updateLab,
  removeLab,
  getLabById,
  getStorages,
  addStorage,
  updateStorage,
  removeStorage,
  getStorageById,
  getChemicalData,
  addChemicalData,
  updateChemicalData,
  removeChemicalData,
  getChemicalDataById,
  getAdminStatistics,
  getRSAStatistics,
  addExperiment,
  getPendingRequests,
  getPreviousRequests,
  getRequestById,
  approveOrRejectRequest,
  getChemicalStock,
  updateChemicalQuantity,
  disposeChemical,
  recordChemical,
  getChemicalListByStorageId,
  getChemicalDisposalByStorageId,
  getStockTakeListByStorageId,
  getStorageStatistics,
  getApprovedToUseChemicals,
  getAvailableChemicalsInStock,
  getAvailableChemicalsInStockC,
  getRequestsDetailsByUserC,
};
