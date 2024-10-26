import { FileText, TestTubes } from "lucide-react";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { DashboardTile } from "@/components/dashboard/DashboardTile";
import { getSignedUser } from "@/lib/userUtils";
import { redirect } from "next/navigation";
import { getChemicalData, getStorages } from "@/db/apiRoutes";
import { Suspense } from "react";
import Loading from "@/app/loading";

const requestsData = [
  { label: "Approved", value: 30 },
  { label: "Pending", value: 7 },
  { label: "Rejected", value: 3 },
  { label: "Saved", value: 1 },
];

export default async function DashboardPage() {
  const user = await getSignedUser();
  if (!user) redirect("/login");

  const chemicalDataResponse = await getChemicalData();
  const chemicalsData = chemicalDataResponse.success
    ? [
      { label: "Risk Level 0-3", value: chemicalDataResponse.data.filter((c: any) => c.riskLevel <= 3).length },
      { label: "Risk Level 4", value: chemicalDataResponse.data.filter((c: any) => c.riskLevel === 4).length },
      { label: "Risk Level 5", value: chemicalDataResponse.data.filter((c: any) => c.riskLevel === 5).length },
    ]
    : [];

  const storageResponse = await getStorages();
  const storageData = storageResponse.success
    ? [
      {
        name: "Locations",
        Institute: storageResponse.data.filter((s: any) => s.placeTag === "institute").length,
        ResearchCentres: storageResponse.data.filter((s: any) => s.placeTag === "researchCentre").length,
        Laboratories: storageResponse.data.filter((s: any) => s.placeTag === "laboratory").length,
      },
    ]
    : [];

  // TODO: Add total requests data from database

  return (
    <main className="flex-grow bg-white p-8">
      <h2 className="mb-4 text-3xl font-bold">Hi {user.name}</h2>
      <p className="mb-8 text-xl">Welcome back to Flinders Chemical Ordering System</p>

      <Suspense fallback={<Loading />}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <DashboardTile icon={FileText} title="Total Requests" data={requestsData} bgColor="bg-emerald-400" />
          <DashboardTile icon={TestTubes} title="Total Chemicals" data={chemicalsData} bgColor="bg-blue-500" />
        </div>
        <DashboardChart title="Storage Locations Chart" data={storageData} />
      </Suspense>  
      
    </main>
  );
}
