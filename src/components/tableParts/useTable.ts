import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function useTable<TData, TValue>({ data, columns }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  // global filter
  const [globalFilter, setGlobalFilter] = React.useState("");

  // checkbox
  const [rowSelection, setRowSelection] = React.useState({});

  // State to manage modal visibility
  const [openStatus, setOpenStatus] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    // sort
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),

    // filter
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),

    // visibility
    onColumnVisibilityChange: setColumnVisibility,

    // checkbox
    onRowSelectionChange: setRowSelection,

    // global filter
    onGlobalFilterChange: setGlobalFilter,

    // all
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });
  return {
    table,

    // global filter
    globalFilter,
    setGlobalFilter,

    // modal
    openStatus,
    setOpenStatus,
  };
}

export default useTable;
