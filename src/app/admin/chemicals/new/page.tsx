"use client";
import TitleLine from "@/components/TitleLine";
import PageButton from "@/components/PageButton";
import React, { useState } from "react";
import InputField from "@/components/InputField";
import CustomModal from "@/components/CustomModal";
import { useRouter } from "next/navigation";
import { ChemicalData } from "src/types";
import { addChemicalData } from "@/db/apiRoutes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useModalReducer } from "../(functions)/useModalReducer";

const riskLevel = [1, 2, 3, 4, 5];

interface FormState {
  commonName: string;
  systematicName: string;
  risk: string;
  expiryPeriod: string;
}

const initialFormState: FormState = {
  commonName: "",
  systematicName: "",
  risk: "",
  expiryPeriod: "",
};

export default function Page() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalProperty, dispatch] = useModalReducer();

  const handleOnChange = (name: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement> | string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: typeof e === "string" ? e : e.target.value,
    }));
  };

  const handleModalViewDetails = () => {
    setIsModalOpen(false);
    router.push("/admin/chemicals");
  };
  const handleModalAddMore = () => {
    setFormState(initialFormState);
    setIsModalOpen(false);
  };
  const handleModalCancel = () => {
    setIsModalOpen(false);
  };
  const handleModalRetry = async () => {
    setIsModalOpen(false);
    await handlePageSubmit();
  };

  const handlePageCancel = () => {
    dispatch({ type: "reset" });
    router.push("/admin/chemicals");
  };

  const handlePageSubmit = async () => {
    if (!formState.commonName || !formState.systematicName || !formState.risk || !formState.expiryPeriod) {
      alert("Common name, Systematic name and Expiry period cannot be empty!");
      return;
    }

    const newChemical: Partial<ChemicalData> = {
      ...formState,
      riskLevel: parseInt(formState.risk, 10),
      expiryPeriod: parseInt(formState.expiryPeriod, 10),
    };

    try {
      const res = await addChemicalData(newChemical);
      if (res.success) {
        console.log("success");
        dispatch({ type: "success", payload: { onClose: handleModalViewDetails, onAction: handleModalAddMore } });
      } else throw new Error();
    } catch (error) {
      dispatch({ type: "fail", payload: { handleModalCancel, handleModalRetry } });
    } finally {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="mx-4">
      <TitleLine name="Add New Chemical" />

      <div className="mt-[60px] flex w-full flex-col items-center justify-center gap-y-4">
        <InputField
          label="Common Name"
          placeholder="Enter chemical name"
          value={formState.commonName}
          onChange={handleOnChange("commonName")}
          className="w-[500px]"
        />
        <InputField
          label="Systematic Name"
          placeholder="Enter Systematic name"
          value={formState.systematicName}
          onChange={handleOnChange("systematicName")}
          className="w-[500px]"
        />

        <div className="mb-4 w-[500px] items-center">
          <label className="mb-2 block font-semibold text-black">Risk Level</label>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-10 w-[500px] items-center justify-between rounded-md border border-blue-500 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {formState.risk}
                <ChevronDown />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[500px]">
              <DropdownMenuLabel>Select Risk Level</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {riskLevel.map((level) => (
                <DropdownMenuItem onSelect={() => handleOnChange("risk")(level.toString())} key={level.toString()}>
                  {level.toString()}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <InputField
          label="Expiry Period"
          placeholder="Enter Expiry Period"
          value={formState.expiryPeriod}
          onChange={handleOnChange("expiryPeriod")}
          className="w-[500px]"
        />
      </div>

      <div className="flex justify-center">
        <div className="mt-[70px] flex w-[400px] items-center justify-between">
          <PageButton color="bg-red-button" hoverColor="bg-red-600" text="Cancel" onClick={handlePageCancel} />
          <PageButton color="bg-green-button" hoverColor="bg-green-600" text="Submit" onClick={handlePageSubmit} />
        </div>
      </div>

      <CustomModal {...modalProperty} isOpen={isModalOpen} />
    </div>
  );
}
