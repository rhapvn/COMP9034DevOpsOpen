import { TableHead, TableHeader, TableRow, TableBody, TableCell, Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { flexRender } from "@tanstack/react-table";
import React from "react";
import { TableForProps } from "src/types";

type MiniTableProps<TData, TValue> = TableForProps & {
  className?: string;
};

function MiniTable<TData, TValue>({ table, className }: MiniTableProps<TData, TValue>) {
  return (
    <div className={"w-full overflow-hidden rounded-md border dark:border-neutral-700"}>
      <div className={cn("h-[300px] max-h-[300px] w-full overflow-auto", className)}>
        <Table>
          <TableHeader className="sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-blue-600 text-white items-center">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row, index) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className={cn(
                  "h-[40px] max-h-[40px]",
                  index % 2 === 1 ? "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20" : "hover:bg-gray-100",
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="h-[40px] max-h-[40px] p-2 items-center">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default MiniTable;
