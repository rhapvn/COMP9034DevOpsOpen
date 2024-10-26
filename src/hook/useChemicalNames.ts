import { useState, useEffect } from 'react';
import { getChemicalData } from "@/db/apiRoutes";
import { ChemicalData } from "src/types";

export const useChemicalNames = () => {
  const [chemical, setChemicals] = useState<ChemicalData[]>([]);

  useEffect(() => {
    const fetchChemicals = async () => {
        const result = await getChemicalData();
        if (result && result.success) {
            setChemicals(result.data);
        } 
    }

    fetchChemicals();
  }, []);

  return chemical;
};