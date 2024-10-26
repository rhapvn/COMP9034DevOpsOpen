import { ChangeEvent, useState } from "react";
import { validateField } from "../../../../lib/validateField";
import { PlaceTag } from "src/types";

export type UserProfileErrorState = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userRole: string;
  placeTag: string;
  placeTagId: string;
};

export const initialErrorState: UserProfileErrorState = {
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  userRole: "",
  placeTag: "",
  placeTagId: "",
};

export interface UserProfileFormState {
  userId: number | undefined;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userRole: string;
  placeTag: PlaceTag;
  placeTagId: number | undefined;
  imagePreview: string;
}

const initialFormState: UserProfileFormState = {
  userId: undefined,
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  userRole: "",
  placeTag: "laboratory",
  placeTagId: undefined,
  imagePreview: "/avatar.png",
};

export const useUserProfileStateAndError = () => {
  const [formState, setFormState] = useState<UserProfileFormState>(initialFormState);
  const [errors, setErrors] = useState<UserProfileErrorState>(initialErrorState);
  const resetFormState = () => setFormState(initialFormState);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name as keyof UserProfileErrorState, value);
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
