import { DataTable } from "@/components/DataTable";
import { StorageColumns } from "@/components/tableParts/columns/StorageColumns";
import TitleLine from "@/components/TitleLine";
import { getStorages } from "@/db/apiRoutes";
import React from "react";

const StoragesPage = async () => {
  const data = { columns: StorageColumns, data: (await getStorages()).data };
  return (
    <div className="mx-4">
      <TitleLine name="Storages" />
      <div className="container mx-auto py-10">
        <DataTable {...data} />
      </div>
    </div>
  );
};

export default StoragesPage;
