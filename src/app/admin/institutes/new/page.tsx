"use client";
import TitleLine from "@/components/TitleLine";
import PageButton from "@/components/PageButton";
import React, { Suspense, useReducer, useState } from "react";
import InputField from "@/components/InputField";
import CustomModal, { BtnActionCol } from "@/components/CustomModal";
import { addInstitute } from "@/db/apiRoutes";
import { useRouter } from "next/navigation";
import { Institute } from "src/types";
import Spinner from "@/components/Spinner";

const modalInitialProperty = {
  title: "Successfully Submitted",
  titleCol: "text-[#111928]",
  lineCol: "border-blue-500",
  description: "Your institute details are successfully saved.",
  btnCancel: true,
  btnCancelCol: "button",
  btnCancelText: "View Details",
  onClose: () => { },
  btnAction: true,
  btnActionCol: "submit",
  btnActionText: "Add More",
  onAction: () => { },
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "success": {
      return {
        ...modalInitialProperty,
        onClose: action.payload.handleModalViewDetails,
        onAction: action.payload.handleModalAddMore,
      };
    }
    case "fail": {
      return {
        ...modalInitialProperty,
        title: "Error",
        titleCol: "text-[#F43F5E]",
        lineCol: "border-red-500",
        description: "There is something went wrong, please try again.",
        btnCancel: true,
        btnCancelCol: "cancel",
        btnCancelText: "Cancel",
        onClose: action.payload.handleModalCancel,
        btnAction: true,
        btnActionCol: "button",
        btnActionText: "Retry",
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

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [modalProperty, dispatch] = useReducer(reducer, modalInitialProperty);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };
  // view details and cancel should be the same, but separate in case there will be different actions
  const handleModalViewDetails = () => {
    setIsModalOpen(false);
    router.push("/admin/institutes");
  };
  const handleModalAddMore = () => {
    setName(""); // clear the form
    setAddress("");
    setIsModalOpen(false);
  };
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };
  const handleModalRetry = async () => {
    setIsModalOpen(false);
    await handlePageSubmit();
  };

  // page cancel & submit button
  const handlePageCancel = () => {
    setName(""); // clear the form
    setAddress("");
    dispatch({ type: "reset" });
    router.push("/admin/institutes"); // should be redirect back to the main page
  };
  const handlePageSubmit = async () => {
    // wrap info
    if (!name || !address) {
      alert("Name and Address cannot be empty!");
      return;
    }
    const newInstitute: Partial<Institute> = {
      name,
      address,
    };

    // send add request
    setIsLoading(true);
    try {
      const res = await addInstitute(newInstitute);
      if (res.success) {
        dispatch({ type: "success", payload: { handleModalViewDetails, handleModalAddMore } });
      } else if (!res.success) {
        dispatch({ type: "fail", payload: { handleModalCancel, handleModalRetry } });
      }
    } catch (error) {
      dispatch({ type: "fail", payload: { handleModalCancel, handleModalRetry } });
    } finally {
      setIsLoading(false);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="mx-4">
      <TitleLine name="Add New Institute" />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-[60px] flex w-full flex-col items-center justify-center gap-y-10">
          <InputField
            label="Place Name"
            placeholder="Place enter institute name"
            value={name}
            onChange={handleNameChange}
            className="w-[500px]"
          />
          <InputField
            label="Address"
            placeholder="Place enter address"
            value={address}
            onChange={handleAddressChange}
            className="w-[500px]"
          />
        </div>
      )}
      <div className="flex justify-center">
        <div className="mt-[70px] flex w-[400px] items-center justify-between">
          <PageButton color="bg-red-button" hoverColor="bg-red-600" text="Cancel" onClick={handlePageCancel} />
          <PageButton color="bg-green-button" hoverColor="bg-green-600" text="Submit" onClick={handlePageSubmit} />
        </div>
      </div>

      <CustomModal
        isOpen={isModalOpen}
        title={modalProperty.title}
        titleCol={modalProperty.titleCol}
        lineCol={modalProperty.lineCol}
        description={modalProperty.description}
        btnCancel={modalProperty.btnCancel}
        btnCancelCol={modalProperty.btnCancelCol as BtnActionCol}
        btnCancelText={modalProperty.btnCancelText}
        onClose={modalProperty.onClose}
        btnAction={modalProperty.btnAction}
        btnActionCol={modalProperty.btnActionCol as BtnActionCol}
        btnActionText={modalProperty.btnActionText}
        onAction={modalProperty.onAction}
      />
    </div>
  );
}
