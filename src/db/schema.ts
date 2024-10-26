import { pgTable, serial, varchar, text, boolean, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Define enums as per the SQL schema
export const placeTagEnum = pgEnum("place_tag_enum", ["institute", "researchCentre", "laboratory"]);
export const userRoleEnum = pgEnum("user_role_enum", ["admin", "researcher", "supervisor", "approver", "storage"]);
export const userStatusEnum = pgEnum("user_status_enum", ["active", "locked", "deactivated"]);
export const experimentStatusEnum = pgEnum("experiment_status_enum", [
  "saved",
  "submitted",
  "escalated",
  "approved",
  "procured",
  "rejected",
  "withdrawn",
]);

// Define table schemas
export const institutesTable = pgTable("institutes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

export const researchCentresTable = pgTable("research_centres", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  instituteId: integer("institute_id").references(() => institutesTable.id, { onDelete: "restrict" }),
});

export const laboratoriesTable = pgTable("laboratories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  centreId: integer("centre_id").references(() => researchCentresTable.id, { onDelete: "restrict" }),
});

export const storageLocationsTable = pgTable("storage_locations", {
  storageId: serial("storage_id").primaryKey(),
  storageName: varchar("storage_name", { length: 255 }).notNull(),
  placeTag: placeTagEnum("place_tag").notNull(),
  placeTagId: integer("place_tag_id").notNull(),
  capacity: integer("capacity").notNull().default(0),
  equipment: text("equipment"),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

export const chemicalDataTable = pgTable("chemical_data", {
  chemicalId: serial("chemical_id").primaryKey(),
  commonName: varchar("common_name", { length: 255 }).notNull(),
  systematicName: varchar("systematic_name", { length: 255 }).notNull(),
  riskLevel: integer("risk_level").notNull().default(1),
  expiryPeriod: integer("expiry_period"),
  isDeleted: boolean("is_deleted").notNull().default(false),
});

export const usersTable = pgTable("users", {
  userId: serial("user_id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: userRoleEnum("role").notNull().default("researcher"),
  status: userStatusEnum("status").notNull().default("active"),
  profileImg: text("profile_img"),
  createdBy: integer("created_by").notNull(),
  createdTime: timestamp("created_time")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  lastUpdateBy: integer("last_update_by"),
  lastUpdateTime: timestamp("last_update_time"),
  placeTag: placeTagEnum("place_tag").notNull(),
  placeTagId: integer("place_tag_id").notNull(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
});

export const stockTable = pgTable("stock", {
  stockId: serial("stock_id").primaryKey(),
  storageId: integer("storage_id").references(() => storageLocationsTable.storageId, { onDelete: "restrict" }),
  chemicalId: integer("chemical_id").references(() => chemicalDataTable.chemicalId, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
  expiryDate: timestamp("expiry_date").notNull(),
  lastUpdatedBy: integer("last_updated_by").references(() => usersTable.userId, { onDelete: "restrict" }),
  lastUpdatedTime: timestamp("last_updated_time").notNull(),
  isOccupied: boolean("is_occupied").notNull().default(false),
});

export const experimentsTable = pgTable("experiments", {
  experimentId: serial("experiment_id").primaryKey(),
  experimentDetails: text("experiment_details").notNull(),
  isRiskAssessmentDone: boolean("is_risk_assessment_done").notNull(),
  highestRiskLevel: integer("highest_risk_level").notNull(),
  status: experimentStatusEnum("status").notNull(),
  lastSavedDate: timestamp("last_saved_date")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  submissionDate: timestamp("submission_date"),
  submittedUserId: integer("submitted_user_id").references(() => usersTable.userId, { onDelete: "restrict" }),
  placeTagId: integer("place_tag_id").notNull(),
  experimentEndDate: timestamp("experiment_end_date"),
  firstApproverId: integer("first_approver_id").references(() => usersTable.userId, { onDelete: "restrict" }),
  firstApprovalTime: timestamp("first_approval_time"),
  firstApproverComments: text("first_approver_comments"),
  secondApproverId: integer("second_approver_id").references(() => usersTable.userId, { onDelete: "restrict" }),
  secondApprovalTime: timestamp("second_approval_time"),
  secondApproverComments: text("second_approver_comments"),
  stockControlId: integer("stock_control_id").references(() => usersTable.userId, { onDelete: "restrict" }),
  stockControlCheckedTime: timestamp("stock_control_checked_time"),
  stockControlComments: text("stock_control_comments"),
});

export const chemicalAssigningTable = pgTable("chemical_assigning", {
  id: serial("id").primaryKey(),
  experimentId: integer("experiment_id").references(() => experimentsTable.experimentId, { onDelete: "restrict" }),
  chemicalId: integer("chemical_id").references(() => chemicalDataTable.chemicalId, { onDelete: "restrict" }),
  stockId: integer("stock_id").references(() => stockTable.stockId, { onDelete: "restrict" }),
  quantity: integer("quantity").notNull(),
});

export const disposalLogsTable = pgTable("disposal_logs", {
  disposalId: serial("disposal_id").primaryKey(),
  chemicalId: integer("chemical_id").references(() => chemicalDataTable.chemicalId),
  stockId: integer("stock_id").references(() => stockTable.stockId),
  disposalDate: timestamp("disposal_date")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  confirmBy: integer("confirm_by").references(() => usersTable.userId, { onDelete: "restrict" }),
});

// Development purpose table
export const membersTable = pgTable("members", {
  userId: serial("user_id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  fullName: varchar("full_name", { length: 100 }),
  email: varchar("email", { length: 100 }).notNull().unique(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
