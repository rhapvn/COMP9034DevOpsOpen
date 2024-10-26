"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/CustomButton";
import { Input } from "@/components/ui/input"; // Make sure to import your Input component
import { AddedChemicalData, AssignedChemicalData, ChemicalInChemicalList, ChemicalStock } from "src/types";

export type ChemicalList = {
  id: number;
  chemicalId: number;
  commonName: string;
  systematicName: string;
  quantity: number;
  riskLevel: number;
};

type FormState = {
  experimentDetails: string;
  experimentEndDate: string;
  riskAssessment: boolean;
  addedChemicals: ChemicalStock[];
};

export const AddedChemicalColumns = (
  setFormState?: React.Dispatch<React.SetStateAction<any>>,
): ColumnDef<ChemicalStock | AddedChemicalData | ChemicalInChemicalList | AssignedChemicalData>[] => {
  const columns: ColumnDef<ChemicalStock | AddedChemicalData | ChemicalInChemicalList | AssignedChemicalData>[] = [
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
      cell: ({ row }) =>
        setFormState ? (
          <Input
            type="number"
            value={row.original.quantity}
            onChange={(e) => {
              const newQuantity = parseInt(e.target.value, 10) || 0;
              setFormState((prev: FormState) => ({
                ...prev,
                addedChemicals: prev.addedChemicals.map((chemical) =>
                  chemical.chemicalId === row.original.chemicalId ? { ...chemical, quantity: newQuantity } : chemical,
                ),
              }));
            }}
            className="w-20"
          />
        ) : (
          row.original.quantity
        ),
    },
    {
      accessorKey: "riskLevel",
      header: "RISK LEVEL",
    },
  ];

  if (setFormState) {
    columns.push({
      id: "delete",
      cell: ({ row }) => (
        <Button
          variant="delete"
          onClick={() =>
            setFormState((prev: FormState) => ({
              ...prev,
              addedChemicals: prev.addedChemicals.filter((chemical) => chemical.chemicalId !== row.original.chemicalId),
            }))
          }
        >
          Delete
        </Button>
      ),
    });
  }

  return columns;
};
