import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/CustomButton";
import { Experiment, ExperimentStatusEnum } from "src/types";
import { STATUS_COLOR } from "@/lib/statusColor";
import { format } from "date-fns";

export const RequestColumns = (setOrderId: (id: number) => void): ColumnDef<Partial<Experiment>>[] => [
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
    accessorKey: "submittedUserName",
    header: "Researcher Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as ExperimentStatusEnum;

      const displayStatus =
        status === "submitted" || status === "escalated" ? "Pending" : status.charAt(0).toUpperCase() + status.slice(1);
      return <span className={`font-bold ${STATUS_COLOR[status]}`}>{displayStatus}</span>;
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
