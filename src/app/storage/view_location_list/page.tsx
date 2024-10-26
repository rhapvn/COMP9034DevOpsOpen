"use client";

import { DataTable } from "@/components/DataTable";
import { StorageLocationListColumns } from "@/components/tableParts/columns/StorageLocationListColumns";
import TitleLine from "@/components/TitleLine";
import { getStorages } from "@/db/apiRoutes";
import useLocalStorageFetch from "src/hook/useLocalStorageFetch";
import { StorageLocation } from "src/types";

const ViewStoragesLocationListPage = () => {
  const [storages, setStorages] = useLocalStorageFetch<StorageLocation[]>(`StorageLocationList`, [], getStorages);
  const data = { columns: StorageLocationListColumns, data: storages };

  return (
    <div className="">
      <TitleLine name="View Storage Location List" />
      <DataTable {...data} />
    </div>
  );
};

export default ViewStoragesLocationListPage;
