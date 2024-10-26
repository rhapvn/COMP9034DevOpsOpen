"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ChemicalStock } from "src/types";
import { AssignChemicalButton } from "../AssignChemicalButton";
import React from "react";

export const AssignChemicalColumns = (
  assignChemical: (assignedChemicalId: number, storageId: number) => void,
  assignedChemicalId: number,
  setIsOpenAssignWindow: React.Dispatch<React.SetStateAction<boolean>>,
  stockId: number,
  necessaryQuantity: number
): ColumnDef<ChemicalStock>[] => [
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
    },
    {
      accessorKey: "placeName",
      header: "PLACE NAME",
    },
    {
      accessorKey: "quantity",
      header: "QUANTITY",
    },
    {
      accessorKey: "riskLevel",
      header: "RISK LEVEL",
    },
    {
      id: "assign",
      cell: ({ row }) => {
        console.log("AssignChemicalColumns", row.original);
        return (
          <AssignChemicalButton
            currentStockId={stockId}
            stockId={row.original.stockId}
            assignChemical={assignChemical}
            setIsOpenAssignWindow={setIsOpenAssignWindow}
            assignedChemicalId={assignedChemicalId}
            disabled={row.original.quantity < necessaryQuantity}
          />
        )
      },
    },
  ];
