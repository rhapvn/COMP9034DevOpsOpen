import { validateField } from "@/lib/validateField";
import { ChangeEvent, useState } from "react";
import { PlaceTag } from "src/types";

export type StorageErrorState = {
  storageName: string;
  capacity: string;
  equipment: string;
  placeTag: string;
  placeTagId: string;
};

const initialErrorState: StorageErrorState = {
  storageName: "",
  capacity: "",
  equipment: "",
  placeTag: "",
  placeTagId: "",
};

export interface StorageFormState {
  storageName: string;
  capacity: string;
  equipment: string;
  placeTag: PlaceTag;
  placeTagId: number | undefined;
}

const initialFormState: StorageFormState = {
  storageName: "",
  capacity: "",
  equipment: "",
  placeTag: "laboratory",
  placeTagId: undefined,
};

export const useStorageStateAndError = () => {
  const [formState, setFormState] = useState<StorageFormState>(initialFormState);
  const [errors, setErrors] = useState<StorageErrorState>(initialErrorState);
  const resetFormState = () => setFormState(initialFormState);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name as keyof StorageFormState, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return {
    formState,
    setFormState,
    errors,
    setErrors,
    resetFormState,
    handleInputChange,
  };
};
