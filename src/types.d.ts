import { Table } from "@tanstack/react-table";
import { placeTagEnum } from "./db/schema";

type Role = "admin" | "researcher" | "supervisor" | "approver" | "storage";

type LoginUser = {
  id: string; //0 if not registered
  name: string;
  role: Role;
  email: string;
  image?: string; //Only in Google
  fullName?: string; //Only in Credentials
};

type User = {
  userId: number;
  firstName: string;
  lastName: string | null;
  phone: string;
  email: string;
  role: Role;
  status: string;
  profileImg: string | null;
  createdBy: number;
  createdTime: Date;
  lastUpdateBy: number;
  lastUpdateTime: Date;
  placeTag: PlaceTag;
  placeTagId: number;
  placeTagName?: string;
  username?: string;
  password?: string;
};

type TableForProps = {
  table: Table<TData>;
};

type PlaceTag = "institute" | "researchCentre" | "laboratory";
type userStatusType = "active" | "locked" | "deactivated";

type Institute = {
  id: number;
  name: string;
  address: string | null;
  isDeleted: boolean;
};

type ResearchCentre = {
  id: number;
  name: string;
  address: string | null;
  isDeleted: boolean;
  instituteId: number | null;
  instituteName?: string;
};

type Laboratory = {
  id: number;
  name: string;
  address: string | null;
  isDeleted: boolean;
  centreId: number | null;
  centreName?: string;
};

type StorageLocation = {
  storageId: number;
  storageName: string;
  placeTag: PlaceTag;
  placeTagId: number;
  placeTagName?: string | undefined | unknown;
  capacity: number;
  equipment: string | null;
};

type ChemicalData = {
  chemicalId: number;
  commonName: string;
  systematicName: string;
  riskLevel: number;
  expiryPeriod: number | null;
};

type DTOResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
};

type ExperimentStatusEnum =
  | "saved"
  | "submitted"
  | "escalated"
  | "approved"
  | "procured"
  | "rejected"
  | "withdrawn"
  | "pending";

type Experiment = {
  experimentId: number;
  experimentDetails: string;
  isRiskAssessmentDone: boolean;
  highestRiskLevel: number;
  status: ExperimentStatusEnum;
  lastSavedDate: Date;
  submissionDate?: Date | null;
  submittedUserId: number;
  placeTagId: number;
  experimentEndDate?: Date | null;
  firstApproverId?: number | null;
  firstApprovalTime?: Date | null;
  firstApproverComments?: string | null;
  secondApproverId?: number | null;
  secondApprovalTime?: Date | null;
  secondApproverComments?: string | null;
  stockControlId?: number | null;
  stockControlCheckedTime?: Date | null;
  stockControlComments?: string | null;
};

type ExperimentWithName = Experiment & {
  submittedUserName?: string;
  firstApproverName?: string;
  secondApproverName?: string;
  stockControlName?: string;
};

type ExperimentDetailsWithLab = {
  experimentDetails: Partial<ExperimentWithName>;
  chemicalList: ChemicalList;
  lab: Laboratory | null;
};

type ChemicalAssigningType = {
  id?: number;
  experimentId?: number;
  chemicalId: number;
  stockId?: number | null;
  quantity: number;
};

type ChemicalInChemicalList = ChemicalAssigningType & {
  commonName?: string;
  systematicName?: string;
  riskLevel?: number;
  pickupStorage?: string;
  placeName?: string;
};

type ChemicalList = ChemicalInChemicalList[];

type AddedChemicalData = {
  id: number;
  chemicalId: number;
  commonName: string;
  systematicName: string;
  quantity: number;
  riskLevel: number;
};

// type AssignedChemicalDataOld = {
//   id: number;
//   storageId: number;
//   storageName: string;
//   chemicalId: number;
//   commonName: string;
//   systematicName: string;
//   quantity: number;
//   riskLevel: number;
//   assignedStorageName: string; //we have to fetch storageName from storageId
// };

type AssignedChemicalData = {
  id: number;
  experimentId: number;
  chemicalId: number;
  commonName: string;
  systematicName: string;
  stockId: number;
  pickupStorage: string;
  placeName: string;
  quantity: number;
  riskLevel: number;
};

type ChemicalStock = Stock & {
  commonName?: string;
  systematicName?: string;
  placeTag?: (typeof placeTagEnum.enumValues)[number];
  placeTagId?: number;
  placeName?: string;
  storageName?: string;
  isDisposed?: boolean;
};

type Stock = {
  stockId?: number;
  storageId: number;
  chemicalId: number;
  quantity: number;
  expiryDate: Date;
  lastUpdatedBy?: number;
  lastUpdatedTime?: Date;
  isOccupied?: boolean;
};

type DisposalLog = {
  disposalId?: number;
  chemicalId: number;
  stockId: number;
  disposalDate?: Date;
  quantity?: number;
  confirmById?: number;
  confirmByName?: string;
};

type ExperimentWithName = Experiment & {
  submittedUserName: string;
  firstApproverName?: string;
  secondApproverName?: string;
  stockControlName?: string;
};

type ExperimentDetails = { experimentDetails: Partial<ExperimentWithName>; chemicalList: ChemicalList };

type RSAStatType = {
  requests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    saved?: number;
  };
  chemicals: {
    total: number;
    risk0_3: number;
    risk4: number;
    risk5: number;
  };
  summary: Array<{
    month_year: string | null;
    pending: number;
    approved: number;
    rejected: number;
  }>;
};

type StockTakeList = Stock & {
  commonName: string;
  systematicName: string;
  confirmBy: string;
  takeDate: Date;
};

type StorageStatType = {
  requests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  availableChemicals: {
    total: number;
    risk0_3: number;
    risk4: number;
    risk5: number;
  };
  availableChemicalsInLocations: {
    total: number;
    institute: number;
    centre: number;
    lab: number;
  };
  summarizedChemicals: {
    occupied: number;
    available: number;
    disposed: number;
  };
};

type ChemicalDataDashboard = {
  label: string;
  value: number;
};

type StorageDataDashboard = {
  name: string;
  Institute: number;
  ResearchCentres: number;
  Laboratories: number;
};
