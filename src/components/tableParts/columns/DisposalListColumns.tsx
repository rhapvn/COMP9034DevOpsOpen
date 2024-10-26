"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DisposalLog } from "src/types";

export const DisposalListColumns: ColumnDef<DisposalLog>[] = [
  {
    id: "disposalList",
  },
  {
    accessorKey: "commonName",
    header: "COMMON NAME",
  },
  {
    accessorKey: "systematicName",
    header: "SYSTEMATIC NAME",
  },
  {
    accessorKey: "quantity",
    header: "QUANTITY",
  },
  {
    accessorKey: "confirmByName",
    header: "CONFIRM BY",
  },
  {
    accessorKey: "disposalDate",
    header: "DISPOSAL DATE",
    cell: ({ row }) => {
      const disposalDate = row.original.disposalDate || "";
      return <span>{disposalDate ? new Date(disposalDate).toLocaleDateString("en-GB") : ""}</span>;
    },
  },
  {
    id: "gap",
  },
];
