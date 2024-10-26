import { ModalProps } from "@/components/CustomModal";
import { useReducer } from "react";

const modalInitialProperty: ModalProps = {
  isOpen: false,
  title: "Successfully Updated",
  titleCol: "text-[#111928]",
  lineCol: "border-[#3758F9]",
  description: "Your chemical details are successfully recorded in the system.",
  btnCancel: true,
  btnCancelCol: "button",
  btnCancelText: "Close",
  onClose: () => {},
  btnAction: false,
  btnActionCol: undefined,
  btnActionText: "",
  onAction: () => {},
};

const modalFailProperty: Partial<ModalProps> = {
  title: "Error",
  titleCol: "text-[#F43F5E]",
  lineCol: "border-[#F43F5E]",
  description: "There is something went wrong, please try again.",
  btnCancel: true,
  btnCancelCol: "cancel",
  btnCancelText: "Cancel",
  btnAction: true,
  btnActionCol: "button",
  btnActionText: "Retry",
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "success": {
      return {
        ...modalInitialProperty,
        onClose: action.payload.handleModalSuccess,
      };
    }
    case "fail": {
      return {
        ...modalInitialProperty,
        ...modalFailProperty,
        onClose: action.payload.handleModalCancel,
        onAction: action.payload.handleModalRetry,
      };
    }
    case "reset": {
      return modalInitialProperty;
    }
    default:
      throw new Error("Invalid action type.");
  }
}

export function useModalReducer() {
  return useReducer(reducer, modalInitialProperty);
}
