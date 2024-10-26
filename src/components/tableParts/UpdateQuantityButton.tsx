import React, { FC, useState } from "react";
import { Button } from "../CustomButton";
import Modal, { ModalProps } from "@/components/CustomModalforUpdate";
import { useRouter } from "next/navigation";
import { disposeChemical, updateChemicalQuantity } from "@/db/apiRoutes";

const UpdateQuantityModalProps: ModalProps = {
  isOpen: true,
  title: "Confirmation",
  titleCol: "text-[#111928]",
  lineCol: "border-[#3758F9]",
  description: "Enter Updated Quantity:",
  inputField: undefined,
  btnCancel: true,
  btnCancelCol: "cancel",
  btnCancelText: "Cancel",
  btnAction: true,
  btnActionCol: "submit",
  btnActionText: "Submit",
};

const SuccessModalProps: ModalProps = {
  isOpen: true,
  title: "Successfully Updated",
  titleCol: "text-[#111928]",
  lineCol: "border-[#3758F9]",
  description: "This chemical quantity has been successfully updated.",
  inputField: undefined,
  btnCancel: false,
  btnCancelText: "Cancel",
  btnCancelCol: "cancel",
  btnAction: true,
  btnActionText: "OK",
  btnActionCol: "button",
};

const ErrorModalProps: ModalProps = {
  isOpen: true,
  title: "Error",
  titleCol: "text-[#F43F5E]",
  lineCol: "border-[#F43F5E]",
  description: "There is something went wrong. Please try again.",
  inputField: undefined,
  btnCancel: true,
  btnCancelText: "Cancel",
  btnCancelCol: "cancel",
  btnAction: true,
  btnActionText: "Retry",
  btnActionCol: "button",
};

export const UpdateQuantityButton: FC<{
  stockId: number;
  chemicalId: number;
  commonName: string | undefined;
  storageName?: string;
  placeTagName: string | undefined;
}> = ({ stockId, chemicalId, commonName, storageName, placeTagName }) => {
  const router = useRouter();
  const [newQuantity, setNewQuantity] = useState("");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isUpdatedSuccess, setIsUpdateSuccess] = useState(false);

  const handleQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewQuantity(e.target.value);
  };

  const handleUpdateCancel = () => {
    setNewQuantity("");
    setIsUpdateModalOpen(false);
  };

  const handleErrorCancel = () => {
    setIsMessageModalOpen(false);
  };

  const handleOK = () => {
    setIsMessageModalOpen(false);
    router.refresh();
  };

  const handleSubmit = async () => {
    setIsUpdateModalOpen(false);

    const quantity = Number(newQuantity);
    try {
      let res;
      if (quantity !== 0) {
        res = await updateChemicalQuantity({ newQuantity: quantity, stockId });
      }

      if (res?.success) {
        setIsUpdateSuccess(true);
      } else {
        setIsUpdateSuccess(false);
      }
    } catch (error) {
      setIsUpdateSuccess(false);
    } finally {
      setIsMessageModalOpen(true);
    }
  };

  const handleRetry = async () => {
    setIsMessageModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <Button variant={"update"} onClick={() => setIsUpdateModalOpen(true)}>
        Update
      </Button>

      {/* Update Modal */}
      <Modal
        {...UpdateQuantityModalProps}
        isOpen={isUpdateModalOpen}
        title={!storageName ? `${commonName} in ${placeTagName}` : `${commonName} in ${storageName} of ${placeTagName}`}
        inputField={
          <input
            type="number"
            className="w-32 rounded-lg border border-blue-500 p-2 text-center outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter quantity..."
            value={newQuantity}
            onChange={handleQuantity}
          />
        }
        onClose={handleUpdateCancel}
        onAction={handleSubmit}
      />

      {/* Success/Error */}
      {isUpdatedSuccess ? (
        <Modal {...SuccessModalProps} isOpen={isMessageModalOpen} onAction={handleOK} />
      ) : (
        <Modal {...ErrorModalProps} isOpen={isMessageModalOpen} onClose={handleErrorCancel} onAction={handleRetry} />
      )}
    </>
  );
};
