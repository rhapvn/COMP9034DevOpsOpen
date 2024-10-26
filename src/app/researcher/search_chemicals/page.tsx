"use client";
import { DataTable } from "@/components/DataTable";
import { ResearcherSearchChemicalColumns } from "@/components/tableParts/columns/ResearcherSearchChemicalColumns";
import TitleLine from "@/components/TitleLine";
import { getApprovedToUseChemicals } from "@/db/apiRoutes";
import React, { useEffect, useState } from "react";
import { ChemicalStock } from "src/types";

const RSearchForChemicalPage: React.FC = () => {
  const [data, setData] = useState({ columns: ResearcherSearchChemicalColumns, data: Array<ChemicalStock>()});

  useEffect(() => {
    const fetchData = async () => {
      const chemicalsResponse = await getApprovedToUseChemicals();
      if (chemicalsResponse.success) {
        setData({ columns: ResearcherSearchChemicalColumns, data: chemicalsResponse.data});
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mx-4">
      <TitleLine name={"Search for Chemicals"} />
      <div className="container mx-auto py-10">
        <DataTable {...data} />
      </div>
    </div>
  );
};

export default RSearchForChemicalPage;
