import { ExperimentStatusEnum, Role } from "src/types";

export const statusDisplayActionJudge = (status: ExperimentStatusEnum | undefined, role: Role) => {
  if (!status) return { displayStatus: "", isActionNeeded: false };

  const displayStatusCases = {
    withdrawn: "Withdrawn",
    saved: "Saved",
    submitted: "Pending",
    escalated: "Pending",
    approved: "Pending",
    rejected: "Rejected",
    procured: "Approved",
  };

  const displayStatus = displayStatusCases[status as keyof typeof displayStatusCases] || "";

  const actionNeededStatus = {
    researcher: status === "saved",
    supervisor: status === "submitted",
    approver: status === "escalated",
    storage: status === "approved",
  };

  const isActionNeeded = actionNeededStatus[role as keyof typeof actionNeededStatus];

  const byLabelResearcher = {
    saved: "Saved Researcher",
    submitted: "Submitted by",
    escalated: "Approved by",
    approved: "Approved by",
    procured: "Approved by",
    pending: "Submitted by",
  };
  const byWhoResearcher = byLabelResearcher[status as keyof typeof byLabelResearcher] || "";

  return { displayStatus, isActionNeeded, byWhoResearcher };
};
