import React, { useEffect, useRef } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/modal/Modal";
import { Button } from "./CustomButton";

export type ModalProps = {
  isOpen: boolean;
  title: string;
  titleCol?: string;
  lineCol?: string;
  description: string;
  btnCancel: boolean;
  btnCancelCol?: BtnActionCol;
  btnCancelText: string;
  onClose?: () => void;
  btnAction: boolean;
  btnActionCol?: BtnActionCol;
  btnActionText: string;
  onAction?: () => void;
};

export const errorModalBaseProps: ModalProps = {
  isOpen: true,
  title: "Error",
  titleCol: "text-rose-500",
  lineCol: "border-rose-500",
  description: "",
  btnCancel: true,
  btnCancelCol: "cancel",
  btnCancelText: "Close",
  btnAction: true,
  btnActionCol: "button",
  btnActionText: "Retry",
  onClose: () => { },
  onAction: () => { },
};

export const successModalBaseProps: ModalProps = {
  isOpen: true,
  title: "Successfully Submitted",
  titleCol: "text-black",
  lineCol: "border-[#3758F9]",
  description: "Your user details are successfully saved.",
  btnCancel: true,
  btnCancelCol: "button",
  btnCancelText: "View Details",
  btnAction: true,
  btnActionCol: "submit",
  btnActionText: "Add more",
  onClose: () => { },
  onAction: () => { },
};

export const closeModalBaseProps: ModalProps = {
  isOpen: true,
  title: "Successful",
  titleCol: "text-black",
  lineCol: "border-[#3758F9]",
  description: "Successful",
  btnCancel: true,
  btnCancelCol: "button",
  btnCancelText: "Close",
  btnAction: false,
  btnActionCol: undefined,
  btnActionText: "",
  onClose: () => { },
  onAction: () => { },
};

export const initialModalProps: ModalProps = {
  isOpen: false,
  title: "Modal Title",
  description: "Modal description goes here.",
  btnCancel: true,
  btnCancelText: "Close",
  btnAction: false,
  btnActionText: "",
};

const Modal = ({
  isOpen,
  title,
  titleCol,
  lineCol,
  description,
  btnCancel,
  btnCancelCol,
  btnCancelText,
  onClose,
  btnAction,
  btnActionCol,
  btnActionText,
  onAction,
}: ModalProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Trigger the modal programmatically when the component mounts
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      triggerRef.current.click();
    }
  }, [isOpen, title, titleCol, lineCol, description, btnCancel, btnCancelCol, btnCancelText, onClose, btnAction, btnActionCol, btnActionText, onAction,]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button ref={triggerRef} style={{ display: "none" }}></button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <p className={`text-center text-[30px] text-lg font-semibold ${titleCol}`}>{title}</p>

            <div className="mb-3 mt-2 flex justify-center">
              <hr className={`w-[25%] border-t-2 ${lineCol}`} />
            </div>
          </AlertDialogTitle>

          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          {/* Button Cancel */}
          {btnCancel && (
            <AlertDialogCancel asChild>
              <Button variant={btnCancelCol} size="modal" onClick={onClose}>
                {btnCancelText}
              </Button>
            </AlertDialogCancel>
          )}

          {/* Button Action */}
          {btnAction && (
            <AlertDialogAction asChild>
              <Button variant={btnActionCol} size="modal" onClick={onAction}>
                {btnActionText}
              </Button>
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Modal;

export type BtnActionCol =
  | "button"
  | "submit"
  | "cancel"
  | "edit"
  | "delete"
  | "lock"
  | "unlock"
  | "active"
  | "deactivate"
  | "lockSta";
