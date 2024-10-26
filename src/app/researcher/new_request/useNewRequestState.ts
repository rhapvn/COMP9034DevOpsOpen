import { useState } from "react";
import { validateField } from "@/lib/validateField";
import { AddedChemicalData } from "src/types";

type FormState = {
  experimentDetails: string;
  experimentEndDate: Date | null; // Change this to Date | null
  riskAssessment: boolean;
  addedChemicals: AddedChemicalData[];
};

type ErrorState = {
  experimentDetails: string;
  experimentEndDate: string;
  riskAssessment: string;
  addedChemicals: string;
};

const initialFormState: FormState = {
  experimentDetails: "",
  experimentEndDate: null, // Initialize as null
  riskAssessment: false,
  addedChemicals: [],
};

const initialErrorState: ErrorState = {
  experimentDetails: "",
  experimentEndDate: "",
  riskAssessment: "",
  addedChemicals: "",
};

export const useNewRequestState = () => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<ErrorState>(initialErrorState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "experimentEndDate") {
      // Convert the string date to a Date object
      const dateValue = value ? new Date(value) : null;
      setFormState((prev) => ({ ...prev, [name]: dateValue }));
      const error = validateField(name as keyof ErrorState, dateValue || "");
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else {
      setFormState((prev) => ({ ...prev, [name]: value }));
      const error = validateField(name as keyof ErrorState, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  return {
    formState,
    setFormState,
    errors,
    setErrors,
    handleInputChange,
  };
};
