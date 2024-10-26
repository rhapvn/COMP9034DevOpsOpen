"use client";
import TitleLine from "@/components/TitleLine";
import { getUserById, updateUserDetails } from "@/db/apiRoutes";
import { uploadFile } from "@/db/api/blobServiceClient";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { User } from "src/types";
import CustomModal, {
  errorModalBaseProps,
  initialModalProps,
  ModalProps,
  successModalBaseProps,
} from "@/components/CustomModal";
import { validateField } from "../../../../../lib/validateField";
import { UserProfileErrorState, useUserProfileStateAndError } from "../../new/useUserProfileStateAndError";
import { usePlaceNames } from "../../../../../hook/usePlaceNames";
import UserRolesInputFields from "../../new/UserRolesInputFields";

const EditUserPage = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const userId = params.id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [modalState, setModalState] = useState<ModalProps>(initialModalProps);
  const { formState, setFormState, errors, setErrors, resetFormState, handleInputChange } =
    useUserProfileStateAndError();
  const placeNames = usePlaceNames(formState.placeTag);

  useEffect(() => {
    const userFetchD = async () => {
      const user = await getUserById(userId);
      if (!user.success) {
        setModalState({
          ...errorModalBaseProps,
          description: user.message as string,
        });
        return;
      }
      if (!user.data) {
        setModalState({
          ...errorModalBaseProps,
          description: "User not found.",
        });
        return;
      }

      setFormState({
        userId: userId,
        email: user.data.email,
        firstName: user.data.firstName,
        lastName: user.data.lastName || "",
        phone: user.data.phone,
        userRole: user.data.role,
        placeTag: user.data.placeTag,
        placeTagId: user.data.placeTagId,
        imagePreview: user.data.profileImg || "/samplePersonnelIcon.jpg",
      });
    };
    userFetchD();
  }, [userId]);

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
      if (error) {
        acc[fieldName] = error;
      }
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
    console.log("upload:", uploadedPicUrl);

    // Update user in the database
    const data: Partial<User> = {
      ...formState,
      profileImg: uploadedPicUrl,
    };

    const result = await updateUserDetails(data);
    if (!result.success) {
      setModalState({
        ...errorModalBaseProps,
        description: result.message as string,
      });
    } else {
      setModalState({
        ...successModalBaseProps,
        description: "Your user details are successfully updated.",
        onClose: handleCloseModal,
      });
    }
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <>
      <TitleLine name="Edit User Role" />
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
            Save
          </button>
        </div>
      </div>

      <CustomModal {...modalState} onClose={handleCloseModal} />
    </>
  );
};

export default EditUserPage;
