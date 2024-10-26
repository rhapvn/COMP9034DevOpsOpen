"use client";

import { DataTable } from "@/components/DataTable";
import { StockSearchChemicalColumns } from "@/components/tableParts/columns/StockSearchChemicalColumns";
import TitleLine from "@/components/TitleLine";
import { getAvailableChemicalsInStock } from "@/db/apiRoutes";
import useLocalStorageFetch from "src/hook/useLocalStorageFetch";
import { ChemicalStock } from "src/types";

const StockSearchForChemicalPage: React.FC = () => {
  const [stock, setStock] = useLocalStorageFetch<ChemicalStock[]>(`StorageSearchStock`, [], getAvailableChemicalsInStock);
  const data = { columns: StockSearchChemicalColumns, data: stock };

  return (
    <div className="mx-4">
      <TitleLine name={"Search for Chemicals"} />
      <DataTable {...data} />
    </div>
  );
};

export default StockSearchForChemicalPage;
