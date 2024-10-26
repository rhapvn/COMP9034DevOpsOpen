import { FileText, TestTubes } from "lucide-react";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { DashboardTile } from "@/components/dashboard/DashboardTile";
import { getSignedUser } from "@/lib/userUtils";
import { redirect } from "next/navigation";
import { getRSAStatistics } from "@/db/apiRoutes";
import { processStatisticsData } from "@/lib/processStatisticsData";

export default async function DashboardPage() {
  const user = await getSignedUser();
  if (!user) redirect("/login");

  const statisticsResponse = await getRSAStatistics();
  const statistics = statisticsResponse.success ? statisticsResponse.data : null;
  const { requestsData, chemicalsData, last3Months } = statistics ? processStatisticsData(statistics) : { requestsData: [], chemicalsData: [], last3Months: [] };

  return (
    <main className="flex-grow bg-white p-8">
      <h2 className="mb-4 text-3xl font-bold">Hi {user.name}</h2>
      <p className="mb-8 text-xl">Welcome back to Flinders Chemical Ordering System</p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <DashboardTile icon={FileText} title="Total Requests" data={requestsData} bgColor="bg-emerald-400" />
        <DashboardTile icon={TestTubes} title="Total Chemicals" data={chemicalsData} bgColor="bg-blue-500" />
      </div>

      <DashboardChart title="Request Statistics" data={last3Months} />
    </main>
  );
}
