"use client";
import TitleLine from "@/components/TitleLine";
import { addUser } from "@/db/apiRoutes";
import { uploadFile } from "@/db/api/blobServiceClient";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useRef, useState } from "react";
import { User } from "src/types";
import CustomModal, {
  errorModalBaseProps,
  initialModalProps,
  ModalProps,
  successModalBaseProps,
} from "@/components/CustomModal";
import { UserProfileErrorState, useUserProfileStateAndError } from "./useUserProfileStateAndError";
import UserRolesInputFields from "./UserRolesInputFields";
import { usePlaceNames } from "src/hook/usePlaceNames";
import { validateField } from "@/lib/validateField";

const NewUserPage: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalState, setModalState] = useState<ModalProps>(initialModalProps);
  const { formState, setFormState, errors, setErrors, resetFormState, handleInputChange } =
    useUserProfileStateAndError();
  const placeNames = usePlaceNames(formState.placeTag);

  const handleProfileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const profileFile = e.target.files?.[0];
    if (profileFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState((prev) => ({ ...prev, imagePreview: reader.result as string }));
      };
      reader.readAsDataURL(profileFile);
    }
  };

  const navigateToUserPage = () => {
    router.push("/admin/user_roles");
  };

  const handleSubmit = async () => {
    // Validate all fields
    const validationErrors: UserProfileErrorState = Object.keys(formState).reduce((acc, key) => {
      const fieldName = key as keyof UserProfileErrorState;
      const fieldValue = formState[fieldName]?.toString() || "";
      const error = validateField(fieldName, fieldValue);
      if (error) acc[fieldName] = error;
      return acc;
    }, {} as UserProfileErrorState);

    //Trigger modal if error
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setModalState({
        ...errorModalBaseProps,
        description: "Please ensure you fill in all the required fields.",
      });
      return;
    }

    // Upload icon image
    let uploadedPicUrl: string | undefined;
    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      const file = fileInputRef.current.files[0];
      try {
        const uploadResult = await uploadFile(file);
        if (!uploadResult.success) {
          setModalState({
            ...errorModalBaseProps,
            description: uploadResult.message || "Error with File Uploading",
          });
          return;
        }
        uploadedPicUrl = uploadResult.data?.url;
      } catch (error) {
        setModalState({
          ...errorModalBaseProps,
          description: "Error with File Uploading: " + (error instanceof Error ? error.message : String(error)),
        });
        return;
      }
    }

    // Add user to the database
    let data: Partial<User> = {
      ...formState,
      profileImg: uploadedPicUrl,
    };
    const result = await addUser(data);
    if (!result.success) {
      setModalState({
        ...errorModalBaseProps,
        description: result.message || "Error with adding user",
      });
    } else {
      setModalState({
        ...successModalBaseProps,
        onAction: () => resetFormState(),
        onClose: () => viewInsertedDetails(result.data.id),
      });
    }
  };

  const viewInsertedDetails = (id: number) => {
    console.log("to detail");
    router.push(`/admin/user_roles/${id}/edit`);
  };

  return (
    <>
      <TitleLine name="Add New User Role" />
      <div className="mx-auto mt-12 max-w-5xl p-6">
        <UserRolesInputFields
          formState={formState}
          setFormState={setFormState}
          errors={errors}
          setErrors={setErrors}
          placeNames={placeNames}
          handleInputChange={handleInputChange}
          handleProfileUpload={handleProfileUpload}
          fileInputRef={fileInputRef}
        />

        <div className="mb-20 mt-20 flex justify-center space-x-6">
          <button className="mr-36 w-20 rounded bg-rose-500 px-4 py-2 text-white" onClick={navigateToUserPage}>
            Cancel
          </button>
          <button className="w-20 rounded bg-emerald-500 px-4 py-2 text-white" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>

      <CustomModal {...modalState} />
    </>
  );
};

export default NewUserPage;
