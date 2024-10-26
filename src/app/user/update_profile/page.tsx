"use client";
import React, { ChangeEvent, useRef, useState, useEffect } from "react";
import { Button } from "@/components/CustomButton";
import TitleLine from "@/components/TitleLine";
import CustomModal, { BtnActionCol } from "@/components/CustomModal";
import { useModalReducer } from "./(functions)/useModalReducer";
import { updateUserPersonalDetails } from "@/db/apiRoutes";
import { User } from "src/types";
import { uploadProfilePic } from "@/lib/fileUtil";
import UserProfileInputFields from "./UserProfileInputFields";
import { UserProfileErrorState, useUserProfileStateAndError } from "./(functions)/useUserProfileStateAndError";
import { validateField } from "./(functions)/validateField";

export default function Page() {
  const [openStatus, setOpenStatus] = useState(false);
  const [modalProperty, dispatch] = useModalReducer();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { formState, setFormState, errors, setErrors, handleInputChange, getUser } = useUserProfileStateAndError();

  useEffect(() => {
    getUser();
  }, []);

  // Handle Update image
  const handleProfileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const profileFile = e.target.files?.[0];
    if (profileFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({ ...prev, profileImg: reader.result as string }));
      };
      reader.readAsDataURL(profileFile);
    }
  };

  // update user personal details
  const updateUser = async () => {
    // Validate all fields
    const validationErrors: UserProfileErrorState = Object.keys(formState).reduce((acc, key) => {
      const fieldName = key as keyof UserProfileErrorState;
      const fieldValue = formState[fieldName]?.toString() || "";
      const error = validateField(fieldName, fieldValue);
      if (error) {
        acc[fieldName] = error;
      }
      return acc;
    }, {} as UserProfileErrorState);

    //Trigger modal if error
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Upload image
    let uploadedPicPath: string | undefined;
    if (fileInputRef.current?.files && fileInputRef.current?.files?.length > 0) {
      const file = fileInputRef.current.files[0];
      try {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResult = await uploadProfilePic(formData);
        if (!uploadResult.success) {
          return;
        }
        uploadedPicPath = uploadResult.path;
      } catch (error) {
        dispatch({ type: "fail", payload: { handleModalCancel, handleModalRetry } });
      }
    }

    // Upload data
    const userDetails: Partial<User> = {
      ...formState,
      profileImg: formState.profileImg,
    };

    try {
      const res = await updateUserPersonalDetails(userDetails);
      if (res.success) {
        console.log("success");
        dispatch({ type: "success", payload: { handleModalSuccess } });
      } else throw new Error();
    } catch (error) {
      dispatch({ type: "fail", payload: { handleModalCancel, handleModalRetry } });
    } finally {
      setOpenStatus(true);
    }
  };

  // Handle edit button
  const [isEditing, setIsEditing] = useState(false);
  // Handler for clicking the edit button
  const handleEditClick = () => {
    setIsEditing(true);
  };
  // Handler for clicking the cancel button
  const handleCancelClick = () => {
    setIsEditing(false);
    window.location.reload();
  };

  // Function to handle modal close (e.g., when clicking "Cancel" or "Retry")
  const handleModalSuccess = () => {
    setOpenStatus(false);
    handleCancelClick();
    window.location.reload();
  };
  const handleModalRetry = () => {
    setOpenStatus(false);
    updateUser();
  };
  const handleModalCancel = () => {
    setOpenStatus(false);
  };

  return (
    <div className="h-screen w-screen">
      {/* Header */}
      <TitleLine name="My Personal Details" />

      <UserProfileInputFields
        formState={formState}
        errors={errors}
        handleInputChange={handleInputChange}
        handleProfileUpload={handleProfileUpload}
        fileInputRef={fileInputRef}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />

      {/* Footer edit button */}
      <div className="mt-8 flex flex-col justify-center">
        <div className="h-1/20 w-1/2 self-center border border-gray-500 p-3">
          {!isEditing ? (
            <Button variant="button" size="button" onClick={handleEditClick}>
              Edit
            </Button>
          ) : (
            <div className="flex justify-between">
              <Button variant="cancel" size="button" onClick={handleCancelClick}>
                Cancel
              </Button>
              <Button variant="submit" size="button" onClick={updateUser}>
                Save
              </Button>
            </div>
          )}
        </div>
      </div>

      <CustomModal {...modalProperty} isOpen={openStatus} />
    </div>
  );
}
