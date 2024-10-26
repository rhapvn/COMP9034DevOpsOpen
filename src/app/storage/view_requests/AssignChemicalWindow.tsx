import React from "react";
import { AssignChemicalColumns } from "@/components/tableParts/columns/AssignChemicalColumns";
import MiniTable from "@/components/tableParts/MiniTable";
import useTable from "@/components/tableParts/useTable";
import { Button } from "@/components/CustomButton";
import { ChemicalStock } from "src/types";

interface AssignChemicalWindowProps {
  isOpenAssignWindow: boolean;
  setIsOpenAssignWindow: React.Dispatch<React.SetStateAction<boolean>>;
  chemicalData: ChemicalStock[];
  assignChemical: (assignedChemicalId: number, storageId: number) => void;
  assignedChemicalId: number;
  stockId: number;
  necessaryQuantity: number;
}

const AssignChemicalWindow: React.FC<AssignChemicalWindowProps> = ({
  isOpenAssignWindow,
  setIsOpenAssignWindow,
  chemicalData,
  assignChemical,
  assignedChemicalId,
  stockId,
  necessaryQuantity
}) => {
  const handleClose = () => setIsOpenAssignWindow(false);
  console.log("AssignChemicalWindow", chemicalData);

  const columns = AssignChemicalColumns(assignChemical, assignedChemicalId, setIsOpenAssignWindow, stockId, necessaryQuantity);
  const { table } = useTable({
    columns,
    data: chemicalData,
  });

  if (!isOpenAssignWindow) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
      <div className="relative w-full max-w-7xl rounded-lg bg-white shadow-lg">
        <div className="flex items-start justify-between rounded-t border-b border-[#3758F9] p-4">
          <h3 className="text-xl font-semibold text-black">Assign Chemical</h3>
          <button
            onClick={handleClose}
            className="ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div className="flex h-[80vh] max-h-[700px] w-full flex-col p-6">
          <div className="flex-grow overflow-auto">
            <MiniTable table={table} className="h-[550px] max-h-[550px]" />
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleClose}
              variant="cancel"
              className="w-36 bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignChemicalWindow;
