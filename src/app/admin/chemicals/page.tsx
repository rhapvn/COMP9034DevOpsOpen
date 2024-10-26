import { DataTable } from "@/components/DataTable";
import { ChemicalColumns } from "@/components/tableParts/columns/ChemicalColumns";
import TitleLine from "@/components/TitleLine";
import { getChemicalData } from "@/db/apiRoutes";
import { Suspense } from "react";
import Loading from "@/app/loading";


const ChemicalsPage = async () => {
  const data = { columns: ChemicalColumns, data: (await getChemicalData()).data };

  return (
    <div className="mx-4">
      <TitleLine name="Chemicals" />
      
      <Suspense fallback={<Loading />}>
        <div className="container mx-auto py-10">
            <DataTable {...data} />
        </div>
      </Suspense>
    </div>
  );
};

export default ChemicalsPage;
