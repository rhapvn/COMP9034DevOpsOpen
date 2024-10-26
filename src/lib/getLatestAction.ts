import { ExperimentDetails } from "src/types";

export const getLatestAction = (order: ExperimentDetails | undefined) => {
  if (!order) return { latestDate: null, latestUserId: null, latestUserName: null, latestComment: "" };

  const details = order.experimentDetails;
  const actions = [
    { date: details.submissionDate, id: details.submittedUserId, name: details.submittedUserName, comment: null },
    {
      date: details.firstApprovalTime,
      id: details.firstApproverId,
      name: details.firstApproverName,
      comment: details.firstApproverComments,
    },
    {
      date: details.secondApprovalTime,
      id: details.secondApproverId,
      name: details.secondApproverName,
      comment: details.secondApproverComments,
    },
    {
      date: details.stockControlCheckedTime,
      id: details.stockControlId,
      name: details.stockControlName,
      comment: details.stockControlComments,
    },
  ];

  const latestAction = actions.reduce((latest, current) => {
    if (current.date && (!latest.date || current.date > latest.date)) {
      return current;
    }
    return latest;
  });

  return {
    latestDate: latestAction.date,
    latestUserId: latestAction.id,
    latestUserName: latestAction.name,
    latestComment: latestAction.comment || "",
  };
};
