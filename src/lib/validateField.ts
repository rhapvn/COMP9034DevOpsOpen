import { ChemicalStock } from "src/types";

type ValidateFieldKeys = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  userRole: string;
  placeTag: string;
  placeTagId: string;
  commonName: string;
  systematicName: string;
  riskLevel: number;
  quantity: number;
  storageName: string;
  capacity: number;
  equipment: string;
  productionDate: string;
  experimentDetails: string;
  experimentEndDate: Date;
  addedChemicals: ChemicalStock[];
  riskAssessment: boolean;
};

export const validateField = (name: keyof ValidateFieldKeys, value: string | Date): string => {
  let error = "";
  switch (name) {
    case "experimentEndDate":
      if (!value) {
        error = "Experiment end date is required";
      } else if (new Date(value) <= new Date()) {
        error = "Experiment end date must be in the future";
      }
      break;
    case "email":
      if (!value) {
        error = "Email is required";
      } else if (typeof value === "string" && !/\S+@\S+\.\S+/.test(value)) {
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
      } else if (typeof value === "string" && !/^\d{10}$/.test(value)) {
        error = "Phone number must be 10 digits";
      }
      break;
    case "userRole":
      if (!value) {
        error = "User role is required";
      }
      break;
    case "placeTag":
      if (typeof value === "string" && !["institute", "researchCentre", "laboratory"].includes(value)) {
        error = "Invalid place tag";
      }
      if (!value) {
        error = "Place tag is required";
      }
      break;

    case "placeTagId":
      if (!value) {
        error = "Place name is required";
      }
      break;
      case "commonName":
        if (!value) {
          error = "Required";
        }
        break;
      case "systematicName":
        if (!value) {
          error = "Required";
        }
        break;
      case "riskLevel":
        if (!value) {
          error = "Required";
        }
        break;
    case "quantity":
      if (!value) {
        error = "Required";
      } else if (isNaN(Number(value))) {
        error = "Input a number";
      }
      break;
    case "storageName":
      if (!value) {
        error = "Storage name is required";
      }
      break;
    case "capacity":
      if (!value) {
        error = "Capacity is required";
      }
      if (isNaN(Number(value))) {
        error = "Capacity must be a number";
      }
      break;
    case "productionDate":
        if (!value) {
          error = "Production date is required";
        } else if (new Date(value) > new Date()) {
          error = "Production date cannot be in the future";
        }
        break;
    case "experimentDetails":
      if (!value) {
        error = "Experiment details are required";
      }
      break;
    case "experimentEndDate":
      if (!value) {
        error = "Experiment end date is required";
      } else if (new Date(value) <= new Date()) {
        error = "Experiment end date must be in the future";
      }
      break;
  }
  return error;
};
