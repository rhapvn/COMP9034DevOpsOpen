import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./modal/Modal";
import { Button } from "./CustomButton";

export type ModalProps = {
  isOpen: boolean;
  title: string;
  titleCol?: string;
  lineCol?: string;
  description: string;
  inputField?: React.ReactNode;
  btnCancel: boolean;
  btnCancelCol?: BtnActionCol;
  btnCancelText: string;
  onClose?: () => void;
  btnAction: boolean;
  btnActionCol?: BtnActionCol;
  btnActionText: string;
  onAction?: () => void;
};

const Modal = ({
  isOpen,
  title,
  titleCol,
  lineCol,
  description,
  inputField,
  btnCancel,
  btnCancelCol,
  btnCancelText,
  onClose,
  btnAction,
  btnActionCol,
  btnActionText,
  onAction,
}: ModalProps) => {
  if (!isOpen) return null; // If modal is not open, return null

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <p className={`text-center text-[30px] text-lg font-semibold ${titleCol}`}>{title}</p>

            <div className="mb-3 mt-2 flex justify-center">
              <hr className={`w-[25%] border-t-2 ${lineCol}`} />
            </div>
          </AlertDialogTitle>

          <AlertDialogDescription className="text-center">{description}</AlertDialogDescription>

          {/* Render the inputField if provided */}
          {inputField && <div className="my-4 flex justify-center">{inputField}</div>}
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
