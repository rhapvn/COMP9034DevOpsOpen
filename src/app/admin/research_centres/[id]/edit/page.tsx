"use client";
import TitleLine from "@/components/TitleLine";
import PageButton from "@/components/PageButton";
import React, { useEffect, useReducer, useState } from "react";
import InputField from "@/components/InputField";
import CustomDropDown from "@/components/DeprecatedCustomDropDown";
import { useRouter } from "next/navigation";
import { getResearchCentreById, updateResearchCentre } from "@/db/apiRoutes";
import CustomModal, { BtnActionCol } from "@/components/CustomModal";
import { ResearchCentre } from "src/types";
import Spinner from "@/components/Spinner";

const modalInitialProperty = {
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
  const id = params.id;
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [instituteId, setInstituteId] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalProperty, dispatch] = useReducer(reducer, modalInitialProperty);
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };
  // get research_centre info and show up
  useEffect(() => {
    async function grabResearchCentre(id: number) {
      try {
        const res = await getResearchCentreById(id);
        const research_centre = await res.data;
        if (!research_centre) return;
        setName(research_centre.name);
        setAddress(research_centre.address || "");
        setInstituteId(research_centre.instituteId ?? 0);
      } catch {
        throw new Error("Fail to fetch research center info...");
      } finally {
        setIsLoading(false);
      }
    }
    if (id) grabResearchCentre(id);
  }, [id]);

  const handleModalCancel = () => {
    setIsModalOpen(false);
    console.log("aaa");
    router.push("/admin/research_centres");
  };
  const handleModalRetry = async () => {
    setIsModalOpen(false);
    await handlePageSave();
  };
  const handlePageCancel = () => {
    router.push("/admin/research_centres");
  };
  const handlePageSave = async () => {
    if (!name || !address || !instituteId) {
      alert("Name and Address cannot be empty!");
      return;
    }
    const updatedResearchCentre: Partial<ResearchCentre> = {
      id,
      name,
      address,
      instituteId,
    };
    setIsLoading(true);
    try {
      console.log("request sent");
      const res = await updateResearchCentre(updatedResearchCentre);
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
      <TitleLine name="Edit Research Centre" />
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="mt-[60px] flex w-full flex-col items-center justify-center gap-y-4">
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
          <CustomDropDown type="Institute" setOrganization={setInstituteId} getOrganization={instituteId} />
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
