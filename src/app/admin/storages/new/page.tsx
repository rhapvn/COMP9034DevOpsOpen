"use client";
import TitleLine from "@/components/TitleLine";
import PageButton from "@/components/PageButton";
import React, { useState } from "react";
import InputField from "@/components/InputField";
import CustomModal, {
  errorModalBaseProps,
  initialModalProps,
  ModalProps,
  successModalBaseProps,
} from "@/components/CustomModal";
import { ChevronDown } from "lucide-react";
import SearchableSelectBox from "@/components/SearchableSelectBox";
import { StorageLocation } from "src/types";
import { addStorage } from "@/db/apiRoutes";
import { useRouter } from "next/navigation";
import { StorageErrorState, useStorageStateAndError } from "./useStorageStateAndError";
import { usePlaceNames } from "src/hook/usePlaceNames";
import { validateField } from "@/lib/validateField";

const NewStoragePage: React.FC = () => {
  const router = useRouter();
  const [modalState, setModalState] = useState<ModalProps>(initialModalProps);
  const { formState, setFormState, errors, setErrors, resetFormState, handleInputChange } = useStorageStateAndError();
  const placeNames = usePlaceNames(formState.placeTag);

  const navigateToStoragePage = () => {
    router.push("/admin/storages");
  };

  const handleSubmit = async () => {
    // Validate all fields
    const validationErrors = Object.keys(formState).reduce(
      (acc, key) => {
        const fieldName = key as keyof typeof formState;
        const fieldValue = formState[fieldName]?.toString() || "";
        const error = validateField(fieldName, fieldValue);
        if (error) {
          acc[fieldName] = error;
        }
        return acc;
      },
      {} as StorageErrorState, // Change this line
    );

    // Trigger modal if error
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setModalState({
        ...errorModalBaseProps,
        description: "Please ensure you fill in all the required fields.",
      });
      return;
    }

    // Add storage to the database
    const newStorage: Partial<StorageLocation> = {
      ...formState,
      capacity: parseInt(formState.capacity),
    };

    try {
      const res = await addStorage(newStorage);
      console.log("from database", res);
      if (res.success) {
        setModalState({
          ...successModalBaseProps,
          onAction: resetFormState,
          onClose: navigateToStoragePage,
        });
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      setModalState({
        ...errorModalBaseProps,
        description: `Error adding storage: ${error}`,
      });
    }
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="mx-4">
      <TitleLine name="Add New Storage" />
      <div className="mx-auto mt-12 flex max-w-5xl p-6">
        <div className="mt-[60px] flex w-[90%] flex-col items-center justify-center gap-y-4">
          <InputField
            label="Storage Name"
            name="storageName"
            placeholder="Enter storage name"
            value={formState.storageName}
            onChange={handleInputChange}
            className="w-full"
            errorMsg={errors.storageName}
          />
          <InputField
            label="Capacity"
            name="capacity"
            placeholder="Enter storage capacity"
            value={formState.capacity}
            onChange={handleInputChange}
            className="w-full"
            errorMsg={errors.capacity}
          />
          <InputField
            label="Equipment"
            name="equipment"
            placeholder="Enter equipment (optional)"
            value={formState.equipment}
            onChange={handleInputChange}
            className="w-full"
            errorMsg={errors.equipment}
          />
        </div>
        <div className="mt-[60px] flex w-full flex-col items-center justify-between">
          <div className="w-[90%]">
            <label className="mb-2 block text-sm font-medium">Place Tag</label>
            <div className="flex justify-between">
              {["institute", "researchCentre", "laboratory"].map((tag) => (
                <label key={tag} className="flex items-center">
                  <input
                    type="radio"
                    name="placeTag"
                    value={tag}
                    checked={formState.placeTag === tag}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <span>
                    {tag === "institute" ? "Institute" : tag === "researchCentre" ? "Research Centre" : "Laboratory"}
                  </span>
                </label>
              ))}
            </div>
            {errors.placeTag && <div className="mt-1 text-sm text-red-500">{errors.placeTag}</div>}
          </div>
          <SearchableSelectBox
            label="Place Name"
            options={placeNames.map((pName) => pName?.name || "")}
            placeholder="Choose Place Name"
            icon={<ChevronDown />}
            iconPosition="right"
            selected={placeNames.find((pName) => pName?.id === formState.placeTagId)?.name || ""}
            setSelected={(selectedName) => {
              const selectedPlace = placeNames.find((pName) => pName?.name === selectedName);
              setFormState((prev) => ({ ...prev, placeTagId: selectedPlace?.id }));
            }}
            name="placeTagId"
            className="m-0 w-[90%] p-0"
            errorMsg={errors.placeTagId}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <div className="mt-[70px] flex w-[400px] items-center justify-between">
          <PageButton color="bg-red-button" hoverColor="bg-red-600" text="Cancel" onClick={navigateToStoragePage} />
          <PageButton color="bg-green-button" hoverColor="bg-green-600" text="Submit" onClick={handleSubmit} />
        </div>
      </div>

      <CustomModal {...modalState} />
    </div>
  );
};

export default NewStoragePage;
