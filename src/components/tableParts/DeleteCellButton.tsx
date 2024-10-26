import { Button } from "@/components/CustomButton";
import Modal, { ModalProps } from "@/components/CustomModal";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { DTOResponse } from "src/types";

const confirmModalProps: ModalProps = {
  isOpen: true,
  description: "",
  title: "Confirmation",
  titleCol: "text-[#111928]",
  lineCol: "border-[#F43F5E]",
  btnCancel: true,
  btnCancelText: "Cancel",
  btnCancelCol: "button",
  btnAction: true,
  btnActionText: "Yes",
  btnActionCol: "cancel",
};

const successModalProps: ModalProps = {
  isOpen: true,
  description: "",
  title: "Successfully deleted",
  titleCol: "text-[#111928]",
  lineCol: "border-[#3758F9]",
  btnCancel: true,
  btnCancelText: "Okay",
  btnCancelCol: "button",
  btnAction: false,
  btnActionText: "Delete",
  btnActionCol: "button",
};

const errorModalProps: ModalProps = {
  isOpen: true,
  description: "",
  title: "Error",
  titleCol: "text-[#F43F5E]",
  lineCol: "border-[#F43F5E]",
  btnCancel: true,
  btnCancelText: "Cancel",
  btnCancelCol: "cancel",
  btnAction: true,
  btnActionText: "Retry",
  btnActionCol: "button",
};

interface DeleteCellButtonProps {
  id: number;
  deleteFunction: (id: number) => Promise<DTOResponse<any>>;
  entityName: string;
}

export const DeleteCellButton: FC<DeleteCellButtonProps> = ({ id, deleteFunction, entityName }) => {
  const router = useRouter();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalMessage, setModalMessage] = useState(false);
  const [deleteResult, setDeleteResult] = useState(false);

  const handleButtonClick = () => {
    setModalConfirm(false);
    setModalMessage(false);
    setDeleteResult(false);
    setModalConfirm(true);
  };

  const handleModalConfirmClose = () => {
    setModalConfirm(false);
  };

  const handleModalMessageClose = () => {
    setModalMessage(false);
    setDeleteResult(false);
    router.refresh();
  };

  const handleConfirm = async () => {
    setModalConfirm(false);
    const res = await deleteFunction(id);
    setDeleteResult(res.success);
    setModalMessage(true);
  };

  const handleRetry = async () => {
    setModalMessage(false);
    const res = await deleteFunction(id);
    console.log(res);
    setDeleteResult(res.success);
    setModalMessage(true);
  };

  return (
    <>
      <Button variant="delete" onClick={handleButtonClick}>
        Delete
      </Button>

      {/* Confirmation */}
      <Modal
        {...confirmModalProps}
        isOpen={modalConfirm}
        description={`Do you want to delete this ${entityName}?`}
        onClose={handleModalConfirmClose}
        onAction={handleConfirm}
      />

      {/* Result Message */}
      {deleteResult ? (
        <Modal
          {...successModalProps}
          isOpen={modalMessage}
          description={`This ${entityName} is successfully deleted`}
          onClose={handleModalMessageClose}
          onAction={handleConfirm}
        />
      ) : (
        <Modal
          {...errorModalProps}
          isOpen={modalMessage}
          description="There is something went wrong. Please try again."
          onClose={handleModalMessageClose}
          onAction={handleRetry}
        />
      )}
    </>
  );
};
