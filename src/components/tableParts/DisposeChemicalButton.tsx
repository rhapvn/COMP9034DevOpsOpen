import { Button } from "@/components/CustomButton";
import Modal, { ModalProps } from "@/components/CustomModal";
import { disposeChemical } from "@/db/apiRoutes";
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
  btnCancelCol: "cancel",
  btnAction: true,
  btnActionText: "Yes, I Confirm",
  btnActionCol: "button",
};

const successModalProps: ModalProps = {
  isOpen: true,
  title: "Successfully Recorded",
  titleCol: "text-[#111928]",
  lineCol: "border-[#3758F9]",
  description: "This chemical has been successfully marked as disposed.",
  btnCancel: true,
  btnCancelText: "OK",
  btnCancelCol: "button",
  btnAction: false,
  btnActionText: "Delete",
  btnActionCol: "button",
};

let errorModalProps: ModalProps = {
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

export const DisposeChemicalButton: FC<{ stockId: number; chemicalId: number; commonName: string | undefined; storageName?: string; placeTagName: string | undefined}> = ({ stockId, chemicalId, commonName, storageName, placeTagName }) => {
  const router = useRouter();
  const [modalConfirm, setModalConfirm] = useState(false);
  const [modalMessage, setModalMessage] = useState(false);
  const [disposalResult, setDisposalResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleModalConfirmClose = () => {
    setModalConfirm(false);
  };

  const handleModalMessageClose = () => {
    setModalMessage(false);
    router.refresh();
  };

  const handleConfirm = async () => {
    setModalConfirm(false);
    const res = await disposeChemical({ stockId, chemicalId });
    
    if(!res?.success) {
      setErrorMessage(res.message || "Something went wrong. Please try again!");
    }
    setDisposalResult(res?.success);
    setModalMessage(true);
  };

  const handleRetry = async() => {
    setModalMessage(false);
    await handleConfirm();
  };

  return (
    <>
      <Button variant="dispose" onClick={() => setModalConfirm(true)}>Disposal Record</Button>

      {/* Confirmation */}
      <Modal
        {...confirmModalProps}
        isOpen={modalConfirm}
        title={!storageName ? `${commonName} in ${placeTagName}` : `${commonName} in ${storageName} of ${placeTagName}`}
        description={`Would you like to record the disposal of this chemical?`}
        onClose={handleModalConfirmClose}
        onAction={handleConfirm}
      />

      {/* Result Message */}
      {disposalResult ? (
        <Modal
          {...successModalProps}
          isOpen={modalMessage}
          onClose={handleModalMessageClose}
        />
      ) : (
        <Modal {...errorModalProps} isOpen={modalMessage} description={errorMessage} onClose={handleModalMessageClose} onAction={handleRetry} />
      )}
    </>
  );
};
