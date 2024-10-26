import { TableHead, TableHeader, TableRow, TableBody, TableCell, Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import React from "react";
import { TableForProps } from "src/types";

type MainTableProps<TData, TValue> = TableForProps & {
  columns: ColumnDef<TData, TValue>[];
  wrapperClassName?: string;
  tableClassName?: string;
  tableHeaderClassName?: string;
  tableBodyClassName?: string;
  tableRowClassName?: string;
  tableCellClassName?: string;
};

function MainTable<TData, TValue>({
  table,
  columns,
  wrapperClassName,
  tableClassName,
  tableHeaderClassName,
  tableBodyClassName,
  tableRowClassName,
  tableCellClassName,
}: MainTableProps<TData, TValue>) {
  return (
    <div className="w-full overflow-hidden rounded-md border dark:border-neutral-700">
      <div className={cn("h-[648px] max-h-[648px] w-full overflow-auto", wrapperClassName)}>
        <Table className={cn("table-auto", tableClassName)}>
          <TableHeader className={tableHeaderClassName}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className={tableRowClassName}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={cn("bg-blue-600 text-white", tableCellClassName)}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className={tableBodyClassName}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    "h-[60px] max-h-[60px]",
                    index % 2 === 1 ? "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20" : "hover:bg-gray-100",
                    tableRowClassName,
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cn("h-[60px] max-h-[60px] pb-1 pt-1", tableCellClassName)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="">
                <TableCell colSpan={columns.length} className="p-2">
                  <div className="w-full flex items-center">

                    <p className="p-5 text-gray-800 text-xl w-full text-center"> No results.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default MainTable;
