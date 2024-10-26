import { UserProfileErrorState,  UserProfileFormState } from "./(functions)/useUserProfileStateAndError"; // UserProfileErrorState, 
import InputField from "@/components/InputField";
import { FaUpload } from "react-icons/fa";

type UserProfileInputFieldsProps = {
  formState: UserProfileFormState;
  errors: UserProfileErrorState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProfileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserProfileInputFields: React.FC<UserProfileInputFieldsProps> = ({
  formState,
  errors,
  handleInputChange,
  handleProfileUpload,
  fileInputRef,
  isEditing,
  setIsEditing,
}) => {

  return (
    <div>
      {/* Picture & Edit picture */}
      <div className="ml-[20%] flex items-center space-y-20">
        <div className="relative h-52 w-52 overflow-hidden rounded-full border border-gray-300">
          <img src={formState.profileImg} alt="" className="h-full w-full object-cover" />
        </div>

        <label className="ml-5 cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} ref={fileInputRef} />

          <div className="w-70 flex items-center justify-center rounded bg-blue-700 px-4 py-2 text-center text-white" onClick={() => setIsEditing(true)}>
            <FaUpload size={18} className="mr-2" />
            <span>Upload New Profile Image</span>
          </div>
        </label>
      </div>

      {/* Table User Profile */}
      <div className="mt-5 flex flex-col items-center">

        <table>
          <tbody>
            <tr>
              <td className="p-2 font-bold">ID</td>
              <td className="p-2">
              <InputField 
                className={`mr-20 w-[80%] p-1 h-8 ${isEditing ? "pointer-events-none" : ""}`}
                // background={`${isEditing ? "bg-[#D4D4D4]" : ""}`}
                tabIndex={-1}
                value={formState.userId || ""}
                disabled={!isEditing}
              />
              </td>
              <td className="p-2 font-bold">Place Tag</td>
              <td className="p-2">
                <InputField 
                  className={`w-[calc(100%+10%)] p-1 h-8 ${isEditing ? "pointer-events-none" : ""}`}
                  // background={`${isEditing ? "bg-[#D4D4D4]" : ""}`}
                  tabIndex={-1}
                  value={formState.placeTagId || ""}
                  disabled={!isEditing}
                />
              </td>
            </tr>
            <tr>
              <td className="pt-6 p-2 font-bold">First Name</td>
              <td className="pt-6 p-2">
              <InputField 
                  className={`w-[80%] p-1 h-8`}
                  name="firstName"
                  value={formState.firstName}
                  placeholder={isEditing ? `${formState.firstName}` : ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  errorMsg={errors.firstName}
                />
              </td>
              <td className="pt-6 p-2 font-bold">Place Name</td>
              <td className="pt-6 p-2">
                <InputField 
                  className={`w-[calc(100%+10%)] p-1 h-8 ${isEditing ? "pointer-events-none" : ""}`}
                  // background={`${isEditing ? "bg-[#D4D4D4]" : ""}`}
                  tabIndex={-1}
                  value={formState.placeTag || ""}
                  disabled={!isEditing}
                />
              </td>
            </tr>
            <tr>
              <td className="pt-6 p-2 font-bold">Last Name</td>
              <td className="pt-6 p-2">
                <InputField 
                  className={`w-[80%] p-1 h-8`}
                  name="lastName"
                  value={formState.lastName}
                  placeholder={isEditing ? `${formState.lastName}` : ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  errorMsg={errors.lastName}
                />
              </td>
              <td className="pt-6 p-2 font-bold">Phone</td>
              <td className="pt-6 p-2">
              <InputField 
                  className={`w-[calc(100%+10%)] p-1 h-8`}
                  name="phone"
                  value={formState.phone}
                  placeholder={isEditing ? `${formState.phone}` : ""}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  errorMsg={errors.phone}
                />
              </td>
            </tr>
            <tr>
              <td className="pt-6 p-2 font-bold">Role</td>
              <td className="pt-6 p-2">
                <InputField 
                  className={`w-[80%] p-1 h-8 ${isEditing ? "pointer-events-none" : ""}`}
                  // background={`${isEditing ? "bg-[#D4D4D4]" : ""}`}
                  tabIndex={-1}
                  value={formState.userRole || ""}
                  disabled={!isEditing}
                />
              </td>
              <td className="pt-6 p-2 font-bold">Email</td>
              <td className="pt-6 p-2">
                <InputField
                  className={`w-[calc(100%+10%)] p-1 h-8 ${isEditing ? "pointer-events-none" : ""}`}
                  // background={`${isEditing ? "bg-[#D4D4D4]" : ""}`}
                  tabIndex={-1}
                  value={formState.email || ""}
                  disabled={!isEditing}
                />
              </td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>

  );
};

export default UserProfileInputFields;
