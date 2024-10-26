import { closeModalBaseProps, ModalProps } from "@/components/CustomModal";
import { useReducer } from "react";

const modalInitialProperty: ModalProps = {
  isOpen: false,
  title: "Successfully Submitted",
  titleCol: "text-[#111928]",
  lineCol: "border-blue-500",
  description: "Your chemical details are successfully saved.",
  btnCancel: true,
  btnCancelCol: "button",
  btnCancelText: "View Details",
  onClose: () => {},
  btnAction: true,
  btnActionCol: "submit",
  btnActionText: "Add More",
  onAction: () => {},
};

const modalFailProperty: Partial<ModalProps> = {
  title: "Error",
  titleCol: "text-[#F43F5E]",
  lineCol: "border-red-500",
  description: "There is something went wrong, please try again.",
  btnCancel: true,
  btnCancelCol: "cancel",
  btnCancelText: "Cancel",
  btnAction: true,
  btnActionCol: "button",
  btnActionText: "Retry",
};

// Define action types
type ModalAction =
  | { type: "success"; payload: { onClose: () => void; onAction?: () => void } } // Updated payload type
  | { type: "fail"; payload: { handleModalCancel: () => void; handleModalRetry: () => void } }
  | { type: "reset" };

function reducer(state: ModalProps, action: ModalAction): ModalProps {
  switch (action.type) {
    case "success": {
      return {
        ...closeModalBaseProps,
        isOpen: true,
        titleCol: closeModalBaseProps.titleCol || "",
        description: "Your chemical details are successfully saved.",
        onClose: action.payload.onClose,
        onAction: action.payload.onAction,
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
