import { Button } from "@/components/CustomButton";
import Modal, { ModalProps } from "@/components/CustomModal";
import { updateUserStatus } from "@/db/apiRoutes";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";

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
  title: "Successfully locked",
  titleCol: "text-[#111928]",
  lineCol: "border-[#3758F9]",
  description: "This user is successfully locked",
  btnCancel: true,
  btnCancelText: "Okay",
  btnCancelCol: "button",
  btnAction: false,
  btnActionText: "Delete",
  btnActionCol: "button",
};

const errorModalProps: ModalProps = {
  isOpen: true,
  title: "Error",
  titleCol: "text-[#F43F5E]",
  lineCol: "border-[#F43F5E]",
  description: "There is something went wrong. Please try again.",
  btnCancel: true,
  btnCancelText: "Cancel",
  btnCancelCol: "cancel",
  btnAction: true,
  btnActionText: "Retry",
  btnActionCol: "button",
};

export const LockButton: FC<{ status: string; userId: number }> = ({ status, userId }) => {
  const router = useRouter();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalMessage, setModalMessage] = useState(false);
  const [deleteResult, setDeleteResult] = useState(false);

  const handleButtonClick = () => {
    setModalConfirm(true);
  };

  const handleModalConfirmClose = () => {
    setModalConfirm(false);
  };

  const handleModalMessageClose = () => {
    setModalMessage(false);
    router.refresh();
  };

  const handleConfirm = async () => {
    setModalConfirm(false);
    const newStatus = status === "active" ? "locked" : "active";
    const res = await updateUserStatus(userId, newStatus);
    setDeleteResult(res.success);
    setModalMessage(true);
  };

  const handleRetry = async () => {
    setModalMessage(false);
    const newStatus = status === "active" ? "locked" : "active";
    const res = await updateUserStatus(userId, newStatus);
    setDeleteResult(res.success);
    setModalMessage(true);
  };

  const buttonProps = {
    onClick: handleButtonClick,
    variant: status === "locked" ? "unlock" : ("lock" as "lock" | "unlock"),
    disabled: status === "deactivated",
  };

  return (
    <>
      <Button {...buttonProps}>{status === "locked" ? "Unlock" : "Lock"}</Button>

      {/* Confirmation */}
      <Modal
        {...confirmModalProps}
        isOpen={modalConfirm}
        description={`Do you want to ${status === "locked" ? "unlock" : "lock"} this user?`}
        onClose={handleModalConfirmClose}
        onAction={handleConfirm}
      />

      {/* Result Message */}
      {deleteResult ? (
        <Modal
          {...successModalProps}
          isOpen={modalMessage}
          onClose={handleModalMessageClose}
          onAction={handleConfirm}
        />
      ) : (
        <Modal {...errorModalProps} isOpen={modalMessage} onClose={handleModalMessageClose} onAction={handleRetry} />
      )}
    </>
  );
};
