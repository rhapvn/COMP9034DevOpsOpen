"use client";
import { FileText, TestTubes } from "lucide-react";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { DashboardTile } from "@/components/dashboard/DashboardTile";
import { getSignedUser } from "@/lib/userUtils";
import { useFetchTwoTypesRequests } from "src/hook/useFetchTwoTypesRequests";
import useLocalStorage from "src/hook/useLocalStorage";
import { Experiment, ChemicalDataDashboard, LoginUser, StorageDataDashboard, ChemicalStock } from "src/types";
import { useStorageDashboardData } from "src/hook/useStorageDashboardData";
import { useEffect } from "react";
import { processRequestsData } from "./processRequestsData";
import { getAvailableChemicalsInStock, getAvailableChemicalsInStockC, getStorages } from "@/db/apiRoutes";

export default function DashboardPage() {
  //Fetch User
  const [user, setUser] = useLocalStorage<LoginUser | null>("user", null);
  !user && console.log("DashboardPage loading");
  useEffect(() => {
    const fetchData = async () => {
      const fetchedUser = await getSignedUser();
      fetchedUser && setUser(fetchedUser);
      console.log("user done");
    };
    fetchData();
  }, [setUser]);

  //Fetch Dashboard Data
  const [chemicalData, setChemicalData] = useLocalStorage<ChemicalDataDashboard[]>(`StorageChemicalData`, []);
  const [storageData, setStorageData] = useLocalStorage<StorageDataDashboard[]>(`StorageStorageData`, []);
  useStorageDashboardData(setChemicalData, setStorageData);

  //Fetch Chemical Stock
  const [stock, setStock] = useLocalStorage<ChemicalStock[]>(`StorageSearchStock`, []);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getAvailableChemicalsInStock();
      if (res.success) {
        setStock(res.data);
      }
      console.log("Search done");
    };
    fetchData();
  }, [setStock]);

  //Fetch Storage Location List
  const [storages, setStorages] = useLocalStorage<any[]>(`StorageLocationList`, []);
  useEffect(() => {
    const fetchData = async () => {
      const res = await getStorages();
      if (res.success) {
        setStorages(res.data);
      }
      console.log("Location done");
    };
    fetchData();
  }, [setStorages]);

  //Fetch Requests
  const [pendingRequests, setPendingRequests] = useLocalStorage<Experiment[] | undefined>(
    `StoragePendingRequests`,
    undefined,
  );
  const [previousRequests, setPreviousRequests] = useLocalStorage<Experiment[] | undefined>(
    `StoragePreviousRequests`,
    undefined,
  );
  useFetchTwoTypesRequests(-1, setPendingRequests, setPreviousRequests);

  //Process
  const requestsData = processRequestsData(previousRequests);
  const storageDataWithName = storageData as StorageDataDashboard[];
  return (
    <main className="flex-grow bg-white p-8">
      <h2 className="mb-4 text-3xl font-bold">Hi {user?.name || ""}</h2>
      <p className="mb-8 text-xl">Welcome back to Flinders Chemical Ordering System</p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <DashboardTile icon={FileText} title="Total Requests" data={requestsData} bgColor="bg-emerald-400" />
        <DashboardTile icon={TestTubes} title="Total Chemicals" data={chemicalData} bgColor="bg-blue-500" />
      </div>

      <DashboardChart title="Storage Locations Chart" data={storageDataWithName} />
    </main>
  );
}
