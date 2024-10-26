"use client";
import { DataTable } from "@/components/DataTable";
import { DisposalListColumns } from "@/components/tableParts/columns/DisposalListColumns";
import TitleLine from "@/components/TitleLine";
import { getChemicalDisposalByStorageId } from "@/db/apiRoutes";
import React, { useEffect, useState } from "react";
import { DisposalLog, StorageLocation } from "src/types";

export default function ViewDisposalListPage({ params }: { params: { id: number } }) {
  const id = params.id;
  const [data, setData] = useState({ columns: DisposalListColumns, data: Array<DisposalLog>() });
  const item = localStorage.getItem("StorageLocationList");
  const currentArray = item ? JSON.parse(item) : "StorageName";
  const storageArray = currentArray.filter((storage: StorageLocation) => storage.storageId == id);

  useEffect(() => {
    const fetchData = async () => {
      const disposalListRes = await getChemicalDisposalByStorageId(id);
      if (disposalListRes.success) {
        setData({ columns: DisposalListColumns, data: disposalListRes.data });
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <TitleLine name={`Disposal List for ${storageArray[0].storageName} of ${storageArray[0].placeTagName}`} />
      <div className="container mx-auto py-10">
        <DataTable {...data} />
      </div>
    </>
  );
}
