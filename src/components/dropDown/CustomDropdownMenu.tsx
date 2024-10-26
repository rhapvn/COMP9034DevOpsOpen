"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { getInstitutes, getResearchCentres } from "@/db/apiRoutes";
import { Institute, ResearchCentre } from "src/types";

type CustomDropdownMenuProps = {
  type: string;
  setOrganization: (value: number) => void;
  getOrganization?: number;
};

export default function CustomDropdownMenu({ type, setOrganization, getOrganization }: CustomDropdownMenuProps) {
  let defaultValue = type === "Institute" ? "Choose Institute" : "Choose Research Centre";
  const [selected, setSelected] = useState(defaultValue);
  const [researchCentres, setResearchCentres] = useState<ResearchCentre[]>([]);
  const [institutes, setInstitutes] = useState<Institute[]>([]);

  useEffect(() => {
    async function grabResearchCentres() {
      try {
        const res = await getResearchCentres();
        if (res.success) {
          const researchCentreList = await res.data;
          setResearchCentres(researchCentreList);
          if (getOrganization) {
            const selectedOrganization = researchCentreList.find(
              (centre: ResearchCentre) => centre.id === getOrganization,
            );
            if (selectedOrganization) setSelected(selectedOrganization.name);
          }
        }
      } catch (error) {
        throw new Error("Failed to getRsearchCentres");
      }
    }

    async function grabInstitutes() {
      try {
        const res = await getInstitutes();
        if (res.success) {
          const instituteList = await res.data;
          setInstitutes(instituteList);
          if (getOrganization) {
            const selectedOrganization = instituteList.find((institute: Institute) => institute.id === getOrganization);
            if (selectedOrganization) setSelected(selectedOrganization.name);
          }
        }
      } catch (error) {
        throw new Error("Failed to getInstitues");
      }
    }
    type === "Institute" ? grabInstitutes() : grabResearchCentres();
  }, [type, getOrganization]);

  const handleSelect = (id: number, name: string) => {
    setSelected(name);
    setOrganization(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-10 w-[500px] items-center justify-between rounded-md border border-blue-500 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          {selected}
          <ChevronDown />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-80 w-[500px] overflow-y-auto">
        <DropdownMenuLabel>Select Research Centre</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {type === "Institute"
          ? institutes.map((institute) => (
              <DropdownMenuItem
                onSelect={() => handleSelect(institute.id, institute.name)} // Pass both ID and Name
                key={institute.id}
              >
                {institute.name}
              </DropdownMenuItem>
            ))
          : researchCentres.map((researchCentre) => (
              <DropdownMenuItem
                onSelect={() => handleSelect(researchCentre.id, researchCentre.name)} // Pass both ID and Name
                key={researchCentre.id}
              >
                {researchCentre.name}
              </DropdownMenuItem>
            ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
