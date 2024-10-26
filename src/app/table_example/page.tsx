// "use client";

import { DataTable } from "@/components/DataTable";
import { CentreColumns } from "@/components/tableParts/columns/CentreColumns";
import { ChemicalColumns } from "@/components/tableParts/columns/ChemicalColumns";
import { InstituteColumns } from "@/components/tableParts/columns/InstituteColumns";
import { LabColumns } from "@/components/tableParts/columns/LabColumns";
import { StorageColumns } from "@/components/tableParts/columns/StorageColumns";
import { UserColumns } from "@/components/tableParts/columns/UserColumns";
import { getChemicalData, getInstitutes, getLabs, getResearchCentres, getStorages, getUsers } from "@/db/apiRoutes";

export default async function TablePage() {
  // const data = { columns: ChemicalColumns, data: (await getChemicalData()).data };
  // const data = { columns: InstituteColumns, data: (await getInstitutes()).data };
  // const data = { columns: CentreColumns, data: (await getResearchCentres()).data };
  // const data = { columns: LabColumns, data: (await getLabs()).data };
  // const data = { columns: StorageColumns, data: (await getStorages()).data };
  const data = { columns: UserColumns, data: (await getUsers()).data };

  return (
    <div className="flex max-w-7xl flex-col items-center justify-center bg-white shadow-lg shadow-blue-600">
      <div className="w-full">
        <div>example/page.tsx</div>
      </div>

      <div className="1h-20 flex items-center justify-center text-3xl">COMP9034DevOps Team4 Demo</div>
      <div className="container mx-auto py-10">
        <DataTable {...data} />
      </div>
    </div>
  );
}
