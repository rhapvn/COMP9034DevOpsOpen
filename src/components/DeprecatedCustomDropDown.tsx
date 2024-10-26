import React from "react";
import CustomDropdownMenu from "./dropDown/CustomDropdownMenu";

type CustomDropDownProps = {
  type: string;
  setOrganization: (value: number) => void;
  getOrganization?: number;
};

export default function CustomDropDown({ type, setOrganization, getOrganization }: CustomDropDownProps) {
  let dropDownLabel = type === "Institute" ? "Institute" : "Research Centre";
  return (
    <div className="mb-4 w-[500px] items-center">
      <label className="mb-2 block font-semibold text-black">{dropDownLabel}</label>
      <CustomDropdownMenu type={type} setOrganization={setOrganization} getOrganization={getOrganization} />
    </div>
  );
}
