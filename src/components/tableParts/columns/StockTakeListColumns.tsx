"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StockTakeList } from "src/types";

export const StockTakeListColumns: ColumnDef<StockTakeList>[] = [
  {
    id: "stockTakeList",
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
    accessorKey: "confirmBy",
    header: "CONFIRM BY",
  },
  {
    accessorKey: "takeDate",
    header: "TAKE DATE",
    cell: ({ row }) => {
      const takeDate = row.original.takeDate || "";
      return <span>{takeDate ? new Date(takeDate).toLocaleDateString("en-GB") : ""}</span>;
    },
  },
  {
    id: "gap",
  },
];
