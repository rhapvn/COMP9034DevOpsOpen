"use client";
import TitleLine from "@/components/TitleLine";
import { getStorageById, updateStorage } from "@/db/apiRoutes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { StorageLocation } from "src/types";
import CustomModal, {
  closeModalBaseProps,
  errorModalBaseProps,
  initialModalProps,
  ModalProps,
  successModalBaseProps,
} from "@/components/CustomModal";
import InputField from "@/components/InputField";
import { formatPlaceTag } from "@/lib/utils";
import { StorageErrorState, useStorageStateAndError } from "../../new/useStorageStateAndError";
import { validateField } from "@/lib/validateField";
import { usePlaceNames } from "src/hook/usePlaceNames";

const EditStoragePage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const storageId = params.id;
  const [modalState, setModalState] = useState<ModalProps>(initialModalProps);
  const { formState, setFormState, errors, setErrors, resetFormState, handleInputChange } = useStorageStateAndError();
  const placeNames = usePlaceNames(formState.placeTag);

  useEffect(() => {
    const storageFetch = async () => {
      const storage = await getStorageById(storageId);
      if (!storage.success) {
        setModalState({
          ...errorModalBaseProps,
          description: storage.message as string,
        });
        return;
      }

      if (!storage.data) {
        setModalState({
          ...errorModalBaseProps,
          description: "Storage not found.",
        });
        return;
      }
      setFormState({
        storageName: storage.data.storageName,
        capacity: storage.data.capacity.toString(),
        equipment: storage.data.equipment || "",
        placeTag: storage.data.placeTag,
        placeTagId: storage.data.placeTagId,
      });
    };
    storageFetch();
  }, [storageId]);

  const navigateToStoragePage = () => {
    router.push("/admin/storages");
  };

  const handleSubmit = async () => {
    // Validate all fields
    const validationErrors: StorageErrorState = Object.keys(formState).reduce((acc, key) => {
      const fieldName = key as keyof StorageErrorState;
      const fieldValue = formState[fieldName]?.toString() || "";
      const error = validateField(fieldName, fieldValue);
      if (error) {
        acc[fieldName] = error;
      }
      return acc;
    }, {} as StorageErrorState);

    // Trigger modal if error
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setModalState({
        ...errorModalBaseProps,
        description: "Please ensure you fill in all the required fields.",
      });
      return;
    }

    // Update storage in the database
    const updatedStorage: Partial<StorageLocation> = {
      ...formState,
      capacity: parseInt(formState.capacity),
      storageId: storageId,
    };

    try {
      const res = await updateStorage(updatedStorage);
      if (res.success) {
        setModalState({
          ...closeModalBaseProps,
          description: "Your storage details are successfully updated.",

          onClose: handleCloseModal,
        });
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      setModalState({
        ...errorModalBaseProps,
        description: `Error updating storage: ${error}`,
      });
    }
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <TitleLine name="Edit Storage" />
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
          <InputField
            label="Place Tag"
            name="placeTag"
            value={formatPlaceTag(formState.placeTag)}
            disabled={true}
            className="w-[90%]"
          />
          <InputField
            label="Place Name"
            name="placeTagId"
            value={placeNames.find((pName) => pName?.id === formState.placeTagId)?.name || ""}
            disabled={true}
            className="w-[90%]"
          />
        </div>
      </div>
      <div className="mb-20 mt-20 flex justify-center space-x-6">
        <button className="mr-36 w-20 rounded bg-rose-500 px-4 py-2 text-white" onClick={navigateToStoragePage}>
          Cancel
        </button>
        <button className="w-20 rounded bg-emerald-500 px-4 py-2 text-white" onClick={handleSubmit}>
          Save
        </button>
      </div>
      <CustomModal {...modalState} onClose={handleCloseModal} />
    </>
  );
};

export default EditStoragePage;
