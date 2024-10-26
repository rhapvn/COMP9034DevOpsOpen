import { UserProfileErrorState } from "./useUserProfileStateAndError";

export const validateField = (name: keyof UserProfileErrorState, value: string): string => {
  let error = "";
  switch (name) {
    case "email":
      if (!value) {
        error = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Email is invalid";
      }
      break;
    case "firstName":
    case "lastName":
      if (!value) {
        error = `${name === "firstName" ? "First" : "Last"} name is required`;
      }
      break;
    case "phone":
      if (!value) {
        error = "Phone number is required";
      } else if (!/^\d{10}$/.test(value)) {
        error = "Phone number must be 10 digits";
      }
      break;
    case "userRole":
      if (!value) {
        error = "User role is required";
      }
      break;
    case "placeTagId":
      if (!value) {
        error = "Place name is required";
      }
      break;
  }
  return error;
};
