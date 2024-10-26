import { ChangeEvent, useState } from "react";
import { validateField } from "../../../lib/validateField";
import { PlaceTag } from "src/types";

export type ResearchErrorState = {
  placeTag: string;
  placeTagId: string;
  commonName: string;
  systematicName: string;
  riskLevel: string;
  quantity: string;
  storageName: string;
  productionDate: string;
};

export const initialErrorState: ResearchErrorState = {
  placeTag: "",
  placeTagId: "",
  commonName: "",
  systematicName: "",
  riskLevel: "",
  quantity: "",
  storageName: "",
  productionDate: "",
};

export interface ResearchFormState {
  chemicalId: number | undefined;
  commonName: string;
  systematicName: string;
  riskLevel: number | undefined;
  quantity: number | undefined;
  placeTag: PlaceTag;
  placeTagId: number | undefined;
  storageId: number | undefined;
  storageName: string;
  productionDate: Date | undefined;
  expiryPeriod: number | undefined;
  expiryDate: Date | undefined;
}

const initialFormState: ResearchFormState = {
  chemicalId: undefined,
  commonName: "",
  systematicName: "",
  riskLevel: undefined,
  quantity: undefined,
  placeTag: "laboratory",
  placeTagId: undefined,
  storageId: undefined,
  storageName: "",
  productionDate: undefined,
  expiryPeriod: undefined,
  expiryDate: undefined,
};

export const useUserProfileStateAndError = () => {
  const [formState, setFormState] = useState<ResearchFormState>(initialFormState);
  const [errors, setErrors] = useState<ResearchErrorState>(initialErrorState);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name as keyof ResearchErrorState, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  return {
    formState,
    setFormState,
    errors,
    setErrors,
    handleInputChange,
  };
};