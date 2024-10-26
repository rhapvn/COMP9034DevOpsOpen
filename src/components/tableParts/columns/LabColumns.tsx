"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Laboratory } from "src/types";
import { Button } from "@/components/CustomButton";
import { removeLab } from "@/db/apiRoutes";
import { DeleteCellButton } from "../DeleteCellButton";

export const LabColumns: ColumnDef<Laboratory>[] = [
  {
    id: "lab",
  },
  {
    accessorKey: "name",
    header: "PLACE NAME",
  },
  {
    accessorKey: "address",
    header: "ADDRESS",
  },
  {
    accessorKey: "centreName",
    header: "RESEARCH CENTRE",
  },
  {
    id: "edit",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <Button variant="edit">
          <Link href={`/admin/laboratories/${id}/edit`}>Edit</Link>
        </Button>
      );
    },
  },
  {
    id: "delete",
    cell: ({ row }) => <DeleteCellButton id={row.original.id} deleteFunction={removeLab} entityName="laboratory" />,
  },
  {
    id: "gap",
  },
];
