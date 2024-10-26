import { Experiment } from "src/types";

export const processRequestsData = (requests: Experiment[] | undefined) => {
  const submitted = requests?.filter((req) => req.status === "submitted").length || 0;
  const pending = requests?.filter((req) => req.status === "approved" || req.status === "escalated").length || 0;
  const procured = requests?.filter((req) => req.status === "procured").length || 0;
  const rejected = requests?.filter((req) => req.status === "rejected").length || 0;
  return [
    { label: "Submitted", value: submitted },
    { label: "Pending", value: pending },
    { label: "Approved", value: procured },
    { label: "Rejected", value: rejected },
  ];
};
