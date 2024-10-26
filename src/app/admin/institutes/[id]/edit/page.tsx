"use client";
import React, { Suspense, useEffect, useReducer, useState } from "react";
import TitleLine from "@/components/TitleLine";
import PageButton from "@/components/PageButton";
import CustomModal, { BtnActionCol, ModalProps } from "@/components/CustomModal";
import InputField from "@/components/InputField";
import { getInstituteById, updateInstitute } from "@/db/apiRoutes";
import { useRouter } from "next/navigation";
import { Institute } from "src/types";
import Spinner from "@/components/Spinner";

// initial modal for update
const modalInitialProperty: ModalProps = {
  isOpen: false,
  title: "Successfully Updated",
  titleCol: "text-[#111928]",
  lineCol: "border-blue-500",
  description: "Your institute details are successfully updated.",
  btnCancel: true,
  btnCancelCol: "button",
  btnCancelText: "Close",
  onClose: () => { },
  btnAction: false,
  btnActionCol: "button",
  btnActionText: "Retry",
  onAction: () => { },
};

function reducer(state: any, action: any) {
  switch (action.type) {
    case "success": {
      return {
        ...modalInitialProperty,
        onClose: action.payload.handleModalCancel,
      };
    }
    case "fail": {
      return {
        ...modalInitialProperty,
        title: "Error",
        titleCol: "text-[#F43F5E]",
        lineCol: "border-red-500",
        description: "There is something went wrong, please try again.",
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

export default function Page({ params }: { params: { id: number } }) {
  const router = useRouter();
  const id = params.id; // get id from url

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

  // get institute info and show
  useEffect(() => {
    async function grabInstituteById(id: number) {
      try {
        setIsLoading(true);
        const res = await getInstituteById(id);
        const institute = await res.data;
        if (!institute) return;
        setName(institute.name);
        setAddress(institute.address || "");
      } catch (error) {
        throw new Error("Fail to fetch institute info...");
      } finally {
        setIsLoading(false);
      }
    }
    if (id) {
      grabInstituteById(id);
    }
  }, [id]);

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };
  const handleModalRetry = async () => {
    setIsModalOpen(false);
    await handlePageSave();
  };
  const handlePageCancel = () => {
    router.push("/admin/institutes");
  };
  const handlePageSave = async () => {
    if (!name || !address) {
      alert("Name and Address cannot be empty!");
      return;
    }
    const updatedInstitute: Partial<Institute> = {
      id,
      name,
      address,
    };
    setIsLoading(true);
    try {
      const res = await updateInstitute(updatedInstitute);
      console.log(res);
      if (res.success) {
        dispatch({ type: "success", payload: { handleModalCancel } });
      }
      if (!res.success) {
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
      <TitleLine name="Edit Institute" />

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
            placeholder="Place enter institute address"
            value={address}
            onChange={handleAddressChange}
            className="w-[500px]"
          />
        </div>
      )}

      <div className="flex justify-center">
        <div className="mt-[70px] flex w-[400px] items-center justify-between">
          <PageButton color="bg-red-button" hoverColor="bg-red-600" text="Cancel" onClick={handlePageCancel} />
          <PageButton color="bg-green-button" hoverColor="bg-green-600" text="Save" onClick={handlePageSave} />
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
