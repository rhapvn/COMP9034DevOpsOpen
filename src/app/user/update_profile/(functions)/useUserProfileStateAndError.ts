import { ChangeEvent, useState } from "react";
import { fetchUserData } from "./fetchUserData";
import { validateField } from "./validateField";
import { PlaceTag } from "src/types";

export type UserProfileErrorState = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userRole: string;
  placeTag: string;
  placeTagId: string;
  profileImg: string;
};

const initialErrorState: UserProfileErrorState = {
  userId: "",
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  userRole: "",
  placeTag: "",
  placeTagId: "",
  profileImg: "",
};

export interface UserProfileFormState {
  userId: number | undefined;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userRole: string;
  placeTag: PlaceTag | undefined;
  placeTagId: number | undefined;
  profileImg: string;
}

const initialFormState: UserProfileFormState = {
  userId: undefined,
  email: "",
  firstName: "",
  lastName: "",
  phone: "",
  userRole: "",
  placeTag: undefined,
  placeTagId: undefined,
  profileImg: "",
};

export const useUserProfileStateAndError = () => {
  const [formState, setFormState] = useState<UserProfileFormState>(initialFormState);
  const [errors, setErrors] = useState<UserProfileErrorState>(initialErrorState);

  const getUser = async () => {
    const data = await fetchUserData();
    if (data) {
      const userProfile: Partial<UserProfileFormState> = {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName || "",
        phone: data.phone,
        email: data.email,
        userRole: data.role,
        placeTag: data.placeTag,
        placeTagId: data.placeTagId,
        profileImg: data.profileImg || "avatar.png",
      };

      setFormState((prev) => ({
        ...prev,
        ...initialFormState,
        ...userProfile,
      }));
    } else {
      setFormState(initialFormState);
    }
  };

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
    getUser,
    handleInputChange,
  };
};
