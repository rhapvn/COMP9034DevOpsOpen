import { Button } from "@/components/CustomButton";
import Modal, { ModalProps } from "@/components/CustomModal";
import { updateUserStatus } from "@/db/apiRoutes";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { userStatusType } from "src/types";

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
  title: "Success",
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

export const DeactivateButton: FC<{ status: string; userId: number }> = ({ status, userId }) => {
  const router = useRouter();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalMessage, setModalMessage] = useState(false);
  const [deleteResult, setDeleteResult] = useState(false);

  const handleModalMessageClose = () => {
    setModalMessage(false);
    router.refresh();
  };

  const updateStatus = async (newStatus: userStatusType) => {
    const res = await updateUserStatus(userId, newStatus);
    setDeleteResult(res.success);
    setModalMessage(true);
  };

  const handleConfirm = async () => {
    setModalConfirm(false);
    const newStatus = status === "deactivated" ? "active" : "deactivated";
    await updateStatus(newStatus);
  };

  const handleRetry = () => {
    setModalMessage(false);
    handleConfirm();
  };

  const buttonProps = {
    onClick: () => setModalConfirm(true),
    variant: status === "deactivated" ? "active" : ("deactivate" as "active" | "deactivate"),
    disabled: status === "locked",
  };

  return (
    <>
      <Button {...buttonProps}>{status === "deactivated" ? "Activate" : "Deactivate"}</Button>

      {/* Confirmation */}
      <Modal
        {...confirmModalProps}
        isOpen={modalConfirm}
        description={`Do you want to ${status === "active" ? "deactivate" : "activate"} this user?`}
        onClose={() => setModalConfirm(false)}
        onAction={handleConfirm}
      />

      {/* Result Message */}
      {deleteResult ? (
        <Modal
          {...successModalProps}
          isOpen={modalMessage}
          title={`Successfully ${status === "active" ? "deactivated" : "activated"}`}
          description={`This user is successfully ${status === "active" ? "deactivated" : "activated"}`}
          onClose={handleModalMessageClose}
          onAction={handleConfirm}
        />
      ) : (
        <Modal {...errorModalProps} isOpen={modalMessage} onClose={handleModalMessageClose} onAction={handleRetry} />
      )}
    </>
  );
};
