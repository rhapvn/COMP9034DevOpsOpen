"use client";

import { ColumnDef } from "@tanstack/react-table";
import OpenAssignButton from "../OpenAssignButton";
import { AssignedChemicalData, ChemicalStock } from "src/types";

export const AssignedChemicalColumns = (
  assignChemical: (assignedChemicalId: number, storageId: number) => void,
  allChemicalsData: ChemicalStock[],
  isActionNeeded: boolean,
): ColumnDef<AssignedChemicalData>[] => [
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
      header: "QUAN TITY",
    },
    {
      accessorKey: "riskLevel",
      header: "RISK LEVEL",
    },
    {
      accessorKey: "placeName",
      header: "PLACE NAME",
    },
    {
      id: "openAssign",
      cell: ({ row }) => {
        console.log("AssignedChemicalColumns", row.original);
        return (
          <OpenAssignButton
            chemicalId={row.original.chemicalId}
            assignedChemicalId={row.original.id}
            allChemicalsData={allChemicalsData}
            assignChemical={assignChemical}
            stockId={row.original.stockId}
            isActionNeeded={isActionNeeded}
            necessaryQuantity={row.original.quantity}
          />
        )
      },
    },
  ];
