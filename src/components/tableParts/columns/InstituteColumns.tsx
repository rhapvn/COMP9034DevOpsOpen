"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Institute } from "src/types";
import { Button } from "@/components/CustomButton";
import { removeInstitute } from "@/db/apiRoutes";
import { DeleteCellButton } from "../DeleteCellButton";

export const InstituteColumns: ColumnDef<Institute>[] = [
  {
    id: "institute",
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
    id: "edit",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <Button variant="edit">
          <Link href={`institutes/${id}/edit`}>Edit</Link>
        </Button>
      );
    },
  },
  {
    id: "delete",
    cell: ({ row }) => (
      <DeleteCellButton id={row.original.id} deleteFunction={removeInstitute} entityName="institute" />
    ),
  },
  {
    id: "gap",
  },
];
