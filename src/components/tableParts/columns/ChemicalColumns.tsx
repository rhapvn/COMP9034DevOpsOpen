"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ChemicalData } from "src/types";
import { removeChemicalData } from "@/db/apiRoutes";
import { Button } from "@/components/CustomButton";
import { DeleteCellButton } from "../DeleteCellButton";

export const ChemicalColumns: ColumnDef<ChemicalData>[] = [
  {
    id: "chemical",
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
    accessorKey: "riskLevel",
    header: "RISK LEVEL",
  },
  {
    accessorKey: "expiryPeriod",
    header: "EXPIRY PERIOD",
  },

  {
    // accessorKey: "Edit",
    id: "edit",
    cell: ({ row }) => {
      const id = row.original.chemicalId;

      return (
        <Button variant="edit">
          <Link href={`/admin/chemicals/${id}/edit`}>Edit</Link>
        </Button>
      );
    },
  },
  {
    id: "delete",
    cell: ({ row }) => (
      <DeleteCellButton id={row.original.chemicalId} deleteFunction={removeChemicalData} entityName="chemical" />
    ),
  },
  {
    id: "gap",
  },
];
