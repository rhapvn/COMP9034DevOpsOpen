import { Table } from "@tanstack/react-table";

export function getPageNumbers<TData>(table: Table<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  const currentPage = pageIndex + 1; // Convert zero-based index to one-based
  const totalVisiblePages = 5; // Number of visible pages before showing ellipsis

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(pageCount, currentPage + 2);

  // Adjust if we are near the beginning or end of the page range
  if (startPage === 1) {
    endPage = Math.min(totalVisiblePages, pageCount);
  } else if (endPage === pageCount) {
    startPage = Math.max(1, pageCount - totalVisiblePages + 1);
  }

  let pages = [];
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push("...");
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (endPage < pageCount) {
    if (endPage < pageCount - 1) {
      pages.push("...");
    }
    pages.push(pageCount);
  }
  const pageNumbers = pages;

  return { pageNumbers, pageIndex, pageCount };
}
