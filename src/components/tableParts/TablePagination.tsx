import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { getPageNumbers } from "./getPageNumber";
import { TableForProps } from "src/types";
import { Button } from "../ui/button";

const TablePagination = ({ table }: TableForProps) => {
  const { pageNumbers, pageIndex, pageCount } = getPageNumbers(table);

  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center space-x-2">
        {/* <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <DoubleArrowLeftIcon className="h-4 w-4" />
        </Button> */}

        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>

        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <Button
              key={index}
              variant={pageIndex + 1 === page ? "default" : "outline"}
              className="h-8 w-8 p-0"
              onClick={() => table.setPageIndex(page - 1)}
            >
              {page}
            </Button>
          ) : (
            <span key={index} className="flex h-8 w-8 items-center justify-center">
              …
            </span>
          ),
        )}

        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>

        {/* <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <DoubleArrowRightIcon className="h-4 w-4" />
        </Button> */}
      </div>
    </div>
  );
};

export default TablePagination;
