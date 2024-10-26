"use client";
import React, { useState } from "react";
import CustomModal, {
  ModalProps,
  errorModalBaseProps,
  successModalBaseProps,
  closeModalBaseProps,
  initialModalProps,
} from "@/components/CustomModal";
import { Button } from "@/components/CustomButton";

const ModalExamplePage: React.FC = () => {
  const [modalState, setModalState] = useState<ModalProps>(initialModalProps);

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const showSuccessAlert = () => {
    setModalState({
      ...successModalBaseProps,
      description: "onAction is green and onClose is blue",
      onClose: closeModal,
      onAction: closeModal,
    });
  };

  const showErrorAlert = () => {
    setModalState({
      ...errorModalBaseProps,
      description: "onAction is Blue and onClose is Red, with Red title",
      onClose: closeModal,
    });
  };

  const showCustomAlert = () => {
    setModalState({
      ...closeModalBaseProps,
      description: "One Blue button in the middle",
      onClose: closeModal,
    });
  };

  return (
    <div className="flex h-96 flex-col items-center justify-center space-y-4">
      <Button onClick={showSuccessAlert}>Show Success Modal</Button>
      <Button onClick={showErrorAlert}>Show Error Modal</Button>
      <Button onClick={showCustomAlert}>Show Custom Modal</Button>

      <CustomModal {...modalState} />
    </div>
  );
};

export default ModalExamplePage;
