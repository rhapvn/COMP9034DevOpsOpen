"use client";

import * as React from "react";
import { usePathname } from "next/navigation"; // Import usePathname
import { ColumnDef } from "@tanstack/react-table";
import useTable from "./tableParts/useTable";
import { GlobalFilterInput } from "./tableParts/GlobalFilterInput";
import MainTable from "./tableParts/MainTable";
import TablePagination from "./tableParts/TablePagination";
import AddNewButton from "./tableParts/AddNewButton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const tableTypeMap = {
  chemical: { linkTitle: "Chemical", urlLink: "/admin/chemicals/new" },
  institute: { linkTitle: "Institute", urlLink: "/admin/institutes/new" },
  researchCentre: { linkTitle: "Research Centre", urlLink: "/admin/research_centres/new" },
  lab: { linkTitle: "Laboratory", urlLink: "/admin/laboratories/new" },
  storage: { linkTitle: "Storage Location", urlLink: "/admin/storages/new" },
  user: { linkTitle: "User", urlLink: "/admin/user_roles/new" },
};

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const { table, globalFilter, setGlobalFilter } = useTable({ columns, data });

  // get /admin/ from URL to set the add button
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin/");

  const tableType = columns[0].id;
  const { linkTitle = "", urlLink = "" } = tableTypeMap[tableType as keyof typeof tableTypeMap] || {};

  return (
    <div className="px-2 py-2">
      <div className="py-2">
        <div className="ml-auto flex items-end justify-between">
          <GlobalFilterInput globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} label="Search by:" />
          {/* show add button if the url included /admin/ */}
          {isAdminPage && <AddNewButton type={linkTitle} href={urlLink} />}
        </div>
      </div>

      <MainTable table={table} columns={columns} />
      <TablePagination table={table} />
    </div>
  );
}
