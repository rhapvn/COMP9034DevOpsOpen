"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StorageLocation } from "src/types";
import { Button } from "@/components/CustomButton";

import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useLocalStorage from "src/hook/useLocalStorage";

export const StorageLocationListColumns: ColumnDef<StorageLocation>[] = [
  {
    id: "storage",
  },
  {
    accessorKey: "storageName",
    header: "STORAGE NAME",
  },
  {
    accessorKey: "placeTagName",
    header: "PLACE NAME",
  },
  {
    accessorKey: "capacity",
    header: "CAPACITY",
    cell: ({ row }) => {
      const capacity = row.original.capacity;
      return (
        <>
          <div className="text-center">{capacity}</div>
        </>
      );
    },
  },
  {
    header: "EQUIPMENT",
    id: "equipment",
    cell: ({ row }) => {
      const equipment = row.original.equipment;
      return (
        <>
          <div className="flex items-center">
            <div className="w-[100px]">
              <p className="truncate">{equipment}</p>
            </div>
            <div className="ml-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="edit">Details</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 border-2 border-green-500">{equipment}</PopoverContent>
              </Popover>
            </div>
          </div>
        </>
      );
    },
  },
  {
    id: "stockTakeList",
    cell: ({ row }) => {
      const id = row.original.storageId;

      return (
        <Button variant="viewStockList">
          <Link href={`view_location_list/${id}/stockTake`}>View Stock Take List</Link>
        </Button>
      );
    },
  },
  {
    id: "disposalList",
    cell: ({ row }) => {
      const id = row.original.storageId;
      return (
        <Button variant="viewDisposalList">
          <Link href={`view_location_list/${id}/disposal`}>View Disposal List</Link>
        </Button>
      );
    },
  },
  {
    id: "gap",
  },
];
