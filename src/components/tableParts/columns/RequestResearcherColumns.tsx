import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/CustomButton";
import { format } from "date-fns";
import { Experiment, ExperimentStatusEnum } from "src/types";
import { STATUS_COLOR } from "@/lib/statusColor";
import { statusDisplayActionJudge } from "@/lib/statusDisplayActionJudge";

export const RequestResearcherColumns = (setOrderId: (id: number) => void): ColumnDef<Partial<Experiment>>[] => [
  {
    id: "request",
  },
  {
    accessorKey: "experimentDetails",
    header: "Experiment Details",
  },
  {
    accessorKey: "submissionDate",
    header: "Submission Date",
    cell: ({ row }) => {
      const date = row.original.submissionDate;
      if (!date) return "";
      const formattedDate = new Date(date);
      const day = String(formattedDate.getDate()).padStart(2, "0");
      const month = String(formattedDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
      const year = formattedDate.getFullYear();

      return `${day}/${month}/${year}`;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as ExperimentStatusEnum;
      const { displayStatus } = statusDisplayActionJudge(status, "researcher");
      const statusColor = STATUS_COLOR[displayStatus.toLowerCase() as keyof typeof STATUS_COLOR] || "text-black";

      return <span className={`font-bold ${statusColor}`}>{displayStatus}</span>;
    },
  },
  {
    id: "view",
    cell: ({ row }) => {
      const id = row.original.experimentId;
      return (
        <Button variant="edit" onClick={() => setOrderId(id || -1)}>
          View
        </Button>
      );
    },
  },
];
