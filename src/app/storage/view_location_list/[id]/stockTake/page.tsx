"use client";
import TitleLine from "@/components/TitleLine";
import { getStockTakeListByStorageId } from "@/db/apiRoutes";
import React, { useEffect, useState } from "react";
import { StockTakeListColumns } from "@/components/tableParts/columns/StockTakeListColumns";
import { StockTakeList, StorageLocation } from "src/types";
import { DataTable } from "@/components/DataTable";
import useLocalStorageFetch from "src/hook/useLocalStorageFetch";

export default function ViewStockTakeListPage({ params }: { params: { id: number } }) {
  const id = params.id;
  const [data, setData] = useState({ columns: StockTakeListColumns, data: Array<StockTakeList>() });
  const item = localStorage.getItem("StorageLocationList");
  const currentArray = item ? JSON.parse(item) : "StorageName";
  const storageArray = currentArray.filter((storage: StorageLocation) => storage.storageId == id);

  useEffect(() => {
    const fetchData = async () => {
      const stockTakeListRes = await getStockTakeListByStorageId(id);
      if (stockTakeListRes.success) {
        setData({ columns: StockTakeListColumns, data: stockTakeListRes.data });
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <TitleLine name={`Stock Take List for ${storageArray[0].storageName} of ${storageArray[0].placeTagName}`} />
      <div className="container mx-auto py-10">
        <DataTable {...data} />
      </div>
    </>
  );
}
