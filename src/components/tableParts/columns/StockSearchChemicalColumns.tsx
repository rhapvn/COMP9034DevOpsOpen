"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChemicalStock } from "src/types";
import { DisposeChemicalButton } from "../DisposeChemicalButton";
import { UpdateQuantityButton } from "../UpdateQuantityButton";

export const StockSearchChemicalColumns: ColumnDef<ChemicalStock>[] = [
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
    accessorKey: "storageName",
    header: "STORAGE NAME",
    cell: ({ row }) => {
      const storageName = row.original.storageName || "";
      return (
        <span className="line-clamp-2" title={storageName}>
          {storageName}
        </span>
      );
    },
  },
  {
    accessorKey: "placeName",
    header: "PLACE NAME",
    cell: ({ row }) => {
      const placeName = row.original.placeName || "";
      return (
        <span className="line-clamp-2" title={placeName}>
          {placeName}
        </span>
      );
    },
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
    id: "update",
    cell: ({ row }) => {
      return (
        <UpdateQuantityButton
          stockId={row.original.stockId || 0}
          chemicalId={row.original.chemicalId}
          commonName={row.original.commonName}
          storageName={row.original.storageName}
          placeTagName={row.original.placeName}
        />
      );
    },
  },
  {
    id: "disposalRecord",
    cell: ({ row }) => {
      return (
        <DisposeChemicalButton
          stockId={row.original.stockId || 0}
          chemicalId={row.original.chemicalId}
          commonName={row.original.commonName}
          storageName={row.original.storageName}
          placeTagName={row.original.placeName}
        />
      );
    },
  },
  {
    id: "gap",
  },
];
