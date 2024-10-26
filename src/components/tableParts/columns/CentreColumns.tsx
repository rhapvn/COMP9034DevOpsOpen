"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ResearchCentre } from "src/types";
import { Button } from "@/components/CustomButton";
import { removeResearchCentre } from "@/db/apiRoutes";
import { DeleteCellButton } from "../DeleteCellButton";

export const CentreColumns: ColumnDef<ResearchCentre>[] = [
  {
    id: "researchCentre",
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
    accessorKey: "instituteName",
    header: "INSTITUTE",
  },
  {
    id: "edit",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <Button variant="edit">
          <Link href={`/admin/research_centres/${id}/edit`}>Edit</Link>
        </Button>
      );
    },
  },
  {
    id: "delete",
    cell: ({ row }) => (
      <DeleteCellButton id={row.original.id} deleteFunction={removeResearchCentre} entityName="research centre" />
    ),
  },
  {
    id: "gap",
  },
];
