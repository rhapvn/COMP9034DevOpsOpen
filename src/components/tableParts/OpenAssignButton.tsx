import { useState } from "react";
import { Button } from "@/components/CustomButton";
import AssignChemicalWindow from "@/app/storage/view_requests/AssignChemicalWindow";
import { ChemicalStock } from "src/types";
import { ne } from "drizzle-orm";

interface OpenAssignButtonProps {
  chemicalId: number;
  assignedChemicalId: number;
  stockId: number;
  allChemicalsData: ChemicalStock[];
  assignChemical: (assignedChemicalId: number, storageId: number) => void;
  isActionNeeded: boolean;
  necessaryQuantity: number;
}

const OpenAssignButton: React.FC<OpenAssignButtonProps> = ({ chemicalId, allChemicalsData, stockId, assignChemical, assignedChemicalId, isActionNeeded, necessaryQuantity }) => {
  const [isOpenAssignWindow, setIsOpenAssignWindow] = useState(false);
  const chemicalData = allChemicalsData.filter((chemical) => chemical.chemicalId === chemicalId && chemical.isOccupied === false);

  return (
    <div>
      <Button variant={stockId ? "unlock" : "edit"} onClick={() => setIsOpenAssignWindow(true)} className={!isActionNeeded ? "invisible" : ""}>
        {stockId ? "Change" : "Search"}
      </Button>
      <AssignChemicalWindow
        stockId={stockId}
        isOpenAssignWindow={isOpenAssignWindow}
        setIsOpenAssignWindow={setIsOpenAssignWindow}
        chemicalData={chemicalData}
        assignChemical={assignChemical}
        assignedChemicalId={assignedChemicalId}
        necessaryQuantity={necessaryQuantity}
      />
    </div>
  );
};

export default OpenAssignButton;
