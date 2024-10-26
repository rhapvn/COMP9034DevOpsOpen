"use client";
import React, { useState } from "react";
import TitleLine from "@/components/TitleLine";
import { Button } from "@/components/CustomButton";
import CustomModal from "@/components/CustomModal";
import { useModalReducer } from "./(functions)/useModalReducer";
import RecordChemicalsInputField from "./RecordChemicalsInputField";
import { ResearchErrorState, useUserProfileStateAndError } from "./useRecordChemStateAndError";
import { usePlaceNames } from "src/hook/usePlaceNames";
import Link from "next/link";
import { useStorageNames } from "src/hook/useStorageNames";
import { useChemicalNames } from "src/hook/useChemicalNames";
import { validateField } from "@/lib/validateField";
import { recordChemical } from "@/db/apiRoutes";
import { Stock } from "src/types";

export default function DashboardPage() {
  const { formState, setFormState, errors, setErrors, handleInputChange } = useUserProfileStateAndError();
  const placeNames = usePlaceNames(formState.placeTag);
  const [modalProperty, dispatch] = useModalReducer();
  const [openStatus, setOpenStatus] = useState(false);
  const storageNames = useStorageNames();
  const chemicalNames = useChemicalNames();

  // Update data
  const updateData = async () => {
    // Validate all fields
    const validationErrors: ResearchErrorState = Object.keys(formState).reduce((acc, key) => {
      const fieldName = key as keyof ResearchErrorState;
      const fieldValue = formState[fieldName]?.toString() || "";
      const error = validateField(fieldName, fieldValue);
      if (error) {
        acc[fieldName] = error;
      }
      return acc;
    }, {} as ResearchErrorState);

    //Trigger modal if error
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (formState.quantity && formState.chemicalId && formState.storageId
      && formState.productionDate && formState.expiryPeriod) {

      // Convert productionDate to a timestamp (milliseconds)
      const productionDateInMs = formState.productionDate.getTime();
      // Add the expiryPeriod (in days) in milliseconds
      const expiryInMs = formState.expiryPeriod * 24 * 60 * 60 * 1000; // Convert days to milliseconds
      // Calculate the expiryDate by adding productionDateInMs + expiryInMs
      const expiryDate = new Date(productionDateInMs + expiryInMs);

      const researchChem: Stock = {
        storageId: formState.storageId,
        chemicalId: formState.chemicalId,
        quantity: formState.quantity,
        expiryDate: expiryDate,
      };

      // Upload data
      try {
        const res = await recordChemical(researchChem);
        if (res.success) {
          console.log("success");
          dispatch({ type: "success", payload: { handleModalSuccess } });
        } else throw new Error();
      } catch (error) {
        dispatch({ type: "fail", payload: { handleModalCancel, handleModalRetry } });
      } finally {
        setOpenStatus(true);
      }
    }
    else {
      dispatch({ type: "fail", payload: { handleModalCancel, handleModalRetry } });
    }

  };

  // Function to handle modal close (e.g., when clicking "Cancel" or "Retry")
  const handleModalSuccess = () => {
    setOpenStatus(false);
    window.location.reload();
  };
  const handleModalRetry = () => {
    setOpenStatus(false);
    updateData();
  };
  const handleModalCancel = () => {
    setOpenStatus(false);
  };

  return (
    <div className="">
      <TitleLine name="Record Chemicals" />

      <RecordChemicalsInputField
        formState={formState}
        setFormState={setFormState}
        errors={errors}
        setErrors={setErrors}
        placeNames={placeNames}
        storageNames={storageNames}
        chemicalNames={chemicalNames}
        handleInputChange={handleInputChange}
      />

      {/* Footer edit button */}
      <div className="mt-5 flex flex-col justify-center">
        <div className="h-1/20 w-1/3 self-center p-3">
          <div className="flex justify-between">
            <Link href="../storage">
              <Button variant="cancel" size="button">
                Cancel
              </Button>
            </Link>
            <Button variant="submit" size="button" onClick={updateData}>
              Submit
            </Button>
          </div>
        </div>
      </div>

      <CustomModal {...modalProperty} isOpen={openStatus} />

    </div>
  );
};
