"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { User } from "src/types";
import { Button } from "@/components/CustomButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LockButton } from "../LockButton";
import { DeactivateButton } from "../DeactivateButton";

export const UserColumns: ColumnDef<User>[] = [
  {
    id: "user",
  },
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    id: "fullName",
    header: () => <div className="text-left">FULL NAME</div>,
    cell: ({ row }) => {
      const { profileImg, firstName, lastName, email } = row.original;
      const fullName = `${firstName} ${lastName}`;
      return (
        <div className="flex gap-4">
          <div className="size-10">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png"></AvatarImage>
              <AvatarFallback>{profileImg}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div>
              <span className="size-14 font-bold">{fullName}</span>
            </div>
            <div>
              <span className="size-14">{email}</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "PHONE",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status as keyof typeof statusStyles;
      const statusStyles = {
        active: "bg-[#DAF8E6] text-[#1A8245]",
        locked: "bg-[#FED7AA] text-[#EA580C]",
        deactivated: "bg-[#FEEBEB] text-[#E10E0E]",
      };

      return <div className={`rounded-xl p-1 text-center ${statusStyles[status] || ""}`}>{status}</div>;
    },
  },
  {
    accessorKey: "role",
    header: "ROLE",
  },
  {
    id: "edit",
    cell: ({ row }) => {
      const { userId, status } = row.original;
      return (
        <Button variant="edit" disabled={status === "deactivated"}>
          <Link href={`/admin/user_roles/${userId}/edit`}>Edit</Link>
        </Button>
      );
    },
  },
  // active - > lock , deactivate
  // lock -> active, deactivate
  // deativate -> activate
  {
    id: "lock",
    cell: ({ row }) => <LockButton status={row.original.status} userId={row.original.userId} />,
  },
  {
    id: "deactivate",
    cell: ({ row }) => <DeactivateButton status={row.original.status} userId={row.original.userId} />,
  },
  {
    id: "gap",
  },
];
