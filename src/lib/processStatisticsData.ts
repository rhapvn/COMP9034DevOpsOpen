import { RSAStatType } from "src/types";

export const processStatisticsData = (statistics: RSAStatType) => {
  const requestsData = statistics
    ? [
        { label: "Approved", value: statistics.requests.approved },
        { label: "Pending", value: statistics.requests.pending },
        { label: "Rejected", value: statistics.requests.rejected },
        { label: "Saved", value: statistics.requests.saved || 0 },
      ]
    : [];

  const chemicalsData = statistics
    ? [
        { label: "Risk Level 0-3", value: statistics.chemicals.risk0_3 },
        { label: "Risk Level 4", value: statistics.chemicals.risk4 },
        { label: "Risk Level 5", value: statistics.chemicals.risk5 },
      ]
    : [];

  const last3Months = statistics
    ? statistics.summary
        .filter((month) => month.month_year)
        .slice(-3)
        .map((month: { month_year: unknown; pending: number; approved: number; rejected: number }) => ({
          name: new Date(month.month_year as number).toLocaleString("default", { month: "short", year: "numeric" }),
          Pending: month.pending,
          Approved: month.approved,
          Rejected: month.rejected,
        }))
    : [];

  return { requestsData, chemicalsData, last3Months };
};
