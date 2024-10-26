import { Button } from "@/components/CustomButton";

interface AssignChemicalButtonProps {
  stockId: number | undefined;
  assignChemical: (assignedChemicalId: number, storageId: number) => void;
  setIsOpenAssignWindow: (isOpen: boolean) => void;
  assignedChemicalId: number;
  currentStockId: number;
  disabled?: boolean;
}

export const AssignChemicalButton: React.FC<AssignChemicalButtonProps> = ({
  stockId,
  assignChemical,
  setIsOpenAssignWindow,
  assignedChemicalId,
  currentStockId,
  disabled
}) => {
  if (!stockId) return null;

  const handleAssign = () => {
    assignChemical(assignedChemicalId, stockId);
    setIsOpenAssignWindow(false);
  };
  return (
    <div>
      <Button variant={currentStockId == stockId ? "unlock" : "edit"} onClick={handleAssign} disabled={disabled}>
        {currentStockId == stockId ? "Assigned" : "Assign"}
      </Button>
    </div>
  );
};
