"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { StorageLocation } from "src/types";
import { Button } from "@/components/CustomButton";
import { removeStorage } from "@/db/apiRoutes";
import { DeleteCellButton } from "../DeleteCellButton";

export const StorageColumns: ColumnDef<StorageLocation>[] = [
  {
    id: "storage",
  },
  {
    accessorKey: "storageName",
    header: "STORAGE NAME",
  },
  {
    accessorKey: "placeTag",
    header: "PLACE TAG",
  },
  {
    accessorKey: "placeTagName",
    header: "PLACE NAME",
  },
  {
    accessorKey: "capacity",
    header: "CAPACITY",
  },
  {
    id: "edit",
    cell: ({ row }) => {
      const id = row.original.storageId;
      return (
        <Button variant="edit">
          <Link href={`/admin/storages/${id}/edit`}>Edit</Link>
        </Button>
      );
    },
  },
  {
    id: "delete",
    cell: ({ row }) => (
      <DeleteCellButton id={row.original.storageId} deleteFunction={removeStorage} entityName="storage" />
    ),
  },
  {
    id: "gap",
  },
];
