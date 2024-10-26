import { Institute, Laboratory, ResearchCentre } from "src/types";
import { UserProfileErrorState, UserProfileFormState } from "./useUserProfileStateAndError";
import InputField from "@/components/InputField";
import { FaEnvelope, FaPhone, FaUpload, FaUser } from "react-icons/fa";
import SelectBox from "@/components/SelectBox";
import { ChevronDown } from "lucide-react";
import { formatPlaceTag, formatUserRole } from "@/lib/utils";
import SearchableSelectBox from "@/components/SearchableSelectBox";
import { placeTagEnum, userRoleEnum } from "@/db/schema";

type UserRolesInputFieldsProps = {
  formState: UserProfileFormState;
  errors: UserProfileErrorState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setFormState: React.Dispatch<React.SetStateAction<UserProfileFormState>>;
  setErrors: React.Dispatch<React.SetStateAction<UserProfileErrorState>>;
  placeNames: Institute[] | ResearchCentre[] | Laboratory[];
  handleProfileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
};

const UserRolesInputFields: React.FC<UserRolesInputFieldsProps> = ({
  formState,
  errors,
  handleInputChange,
  setFormState,
  setErrors,
  placeNames,
  handleProfileUpload,
  fileInputRef,
}) => {
  const userRoles = userRoleEnum.enumValues;
  const placeTags = placeTagEnum.enumValues;

  return (
    <div className="grid h-[80%] max-h-96 grid-cols-3 gap-6">
      <div className="flex flex-col justify-between">
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="john@flinders.edu.au"
          value={formState.email}
          onChange={handleInputChange}
          icon={<FaEnvelope />}
          errorMsg={errors.email}
        />

        <InputField
          label="First Name"
          name="firstName"
          type="text"
          placeholder="Type your first name"
          value={formState.firstName}
          onChange={handleInputChange}
          icon={<FaUser />}
          errorMsg={errors.firstName}
        />

        <InputField
          label="Last Name"
          name="lastName"
          type="text"
          placeholder="Type your last name"
          value={formState.lastName}
          onChange={handleInputChange}
          icon={<FaUser />}
          errorMsg={errors.lastName}
        />

        <InputField
          label="Phone"
          name="phone"
          type="tel"
          placeholder="Type your phone number"
          value={formState.phone}
          onChange={handleInputChange}
          icon={<FaPhone className="rotate-90" />}
          errorMsg={errors.phone}
        />
      </div>

      <div className="flex grid-cols-subgrid flex-col justify-between">
        <SelectBox
          label="Role"
          options={userRoles.map(formatUserRole)}
          placeholder="Choose Your Role"
          icon={<ChevronDown />}
          iconPosition="right"
          selected={formState.userRole ? formatUserRole(formState.userRole) : ""}
          setSelected={(selectedRole) => {
            setFormState((prev) => ({
              ...prev,
              userRole: selectedRole as (typeof userRoleEnum.enumValues)[number],
            }));
            setErrors((prev) => ({ ...prev, userRole: "" }));
          }}
          name="userRole"
          errorMsg={errors.userRole}
        />

        <div>
          <label className="mb-2 block text-sm font-medium">Place Tag</label>
          <div className={`flex space-x-4 ${errors.placeTag ? "border-red-500" : ""}`}>
            {placeTags.map((tag) => (
              <label key={tag} className="flex items-center">
                <input
                  type="radio"
                  name="placeTag"
                  value={tag}
                  checked={formState.placeTag === tag}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span>{formatPlaceTag(tag)}</span>
              </label>
            ))}
          </div>
          <div className="mt-1 h-5 text-sm text-red-500">{errors.placeTag || "\u00A0"}</div>
        </div>

        <SearchableSelectBox
          label="Place Name"
          options={placeNames.map((pName) => pName?.name || "")}
          placeholder="Choose Place Name"
          icon={<ChevronDown />}
          iconPosition="right"
          selected={placeNames.find((pName) => pName?.id === formState.placeTagId)?.name || ""}
          setSelected={(selectedName) => {
            const selectedPlace = placeNames.find((pName) => pName?.name === selectedName);
            setFormState((prev) => ({
              ...prev,
              placeTagId: selectedPlace?.id || undefined,
            }));
            setErrors((prev) => ({ ...prev, placeTagId: "" }));
          }}
          name="placeTagId"
          errorMsg={errors.placeTagId}
        />
      </div>

      <div className="grid grid-cols-subgrid">
        <div className="h-52 w-52 place-self-center overflow-hidden rounded-full bg-gray-200">
          <img src={formState.imagePreview} alt="" className="h-full w-full object-cover" />
        </div>
        <label className="mt-[-60px] cursor-pointer place-self-center">
          <input type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} ref={fileInputRef} />
          <div className="w-70 flex items-center justify-center rounded bg-blue-700 px-4 py-2 text-center text-white">
            <FaUpload size={18} className="mr-2" />
            <span>Upload Your Profile Image</span>
          </div>
        </label>
      </div>
    </div>
  );
};

export default UserRolesInputFields;
