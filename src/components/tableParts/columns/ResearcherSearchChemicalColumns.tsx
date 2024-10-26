"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChemicalStock } from "src/types";
import { DisposeChemicalButton } from "../DisposeChemicalButton";

export const ResearcherSearchChemicalColumns: ColumnDef<ChemicalStock>[] = [
  {
    id: "searchChemical",
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
    accessorKey: "placeName",
    header: "LABORATORY",
  },
  {
    accessorKey: "quantity",
    header: "QUANTITY",
    cell: ({ row }) => {
      const quantity = row.original.quantity || "";
      return <span>{quantity}</span>;
    },
  },
  {
    accessorKey: "expiryDate",
    header: "EXPIRY DATE",
    cell: ({ row }) => {
      const expiryDate = row.original.expiryDate || "";
      return <span>{expiryDate ? new Date(expiryDate).toLocaleDateString("en-GB") : ""}</span>;
    },
  },
  {
    accessorKey: "isDisposed",
    header: "DISPOSAL STATUS",
    cell: ({ row }) => {
      const disposalStatus = row.original.isDisposed || "";
      return <span className={disposalStatus == true ? "text-blue-500" : "text-red-500"}>{disposalStatus == true ? "Disposed" : "Not Yet"}</span>;
    },
  },
  {
    id: "disposalRecord",
    cell: ({ row }) => {
      const disposalStatus = row.original.isDisposed;
      return disposalStatus == true ? "" : 
      <DisposeChemicalButton 
      stockId={row.original.stockId || 0} 
      chemicalId={row.original.chemicalId}
      commonName={row.original.commonName}
      placeTagName={row.original.placeName}
       />;
    },
  },
  {
    id: "gap",
  },
];
