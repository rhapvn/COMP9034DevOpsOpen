import { useState, useEffect } from 'react';
import { getStorages } from "@/db/apiRoutes";
import { StorageLocation } from "src/types";

export const useStorageNames = () => {
  const [storages, setStorages] = useState<StorageLocation[]>([]);

  useEffect(() => {
    const fetchStorages = async () => {
        const result = await getStorages();
        if (result && result.success) {
          setStorages(result.data);
        } 
    }

    fetchStorages();
  }, []);

  return storages;
};