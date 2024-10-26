import { ExperimentStatusEnum } from "src/types";

export const STATUS_COLOR: Record<ExperimentStatusEnum, string> = {
  submitted: "text-orange-500",
  approved: "text-green-500",
  rejected: "text-red-500",
  withdrawn: "text-gray-500",
  saved: "text-blue-500",
  escalated: "text-yellow-500",
  procured: "text-purple-500",
  pending: "text-orange-500",
};
