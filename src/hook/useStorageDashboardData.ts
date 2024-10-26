"use client";

import { useEffect } from "react";
import { getChemicalData, getStorages } from "@/db/apiRoutes";
import { ChemicalDataDashboard, StorageDataDashboard } from "src/types";

export const useStorageDashboardData = (
  setChemicalData: React.Dispatch<React.SetStateAction<ChemicalDataDashboard[]>>,
  setStorageData: React.Dispatch<React.SetStateAction<StorageDataDashboard[]>>,
) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chemicalDataResponse, storageResponse] = await Promise.all([getChemicalData(), getStorages()]);

        if (chemicalDataResponse.success) {
          const chemicalsData = [
            { label: "Risk Level 0-3", value: chemicalDataResponse.data.filter((c: any) => c.riskLevel <= 3).length },
            { label: "Risk Level 4", value: chemicalDataResponse.data.filter((c: any) => c.riskLevel === 4).length },
            { label: "Risk Level 5", value: chemicalDataResponse.data.filter((c: any) => c.riskLevel === 5).length },
          ];
          setChemicalData(chemicalsData);
        }

        if (storageResponse.success) {
          const storageData = [
            {
              name: "Locations",
              Institute: storageResponse.data.filter((s: any) => s.placeTag === "institute").length,
              ResearchCentres: storageResponse.data.filter((s: any) => s.placeTag === "researchCentre").length,
              Laboratories: storageResponse.data.filter((s: any) => s.placeTag === "laboratory").length,
            },
          ];
          setStorageData(storageData as StorageDataDashboard[]);
        }
        console.log("Dashboard done");
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, [setChemicalData, setStorageData]);
};
