"use client";
import { FileText, TestTubes } from "lucide-react";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { DashboardTile } from "@/components/dashboard/DashboardTile";
import { getSignedUser } from "@/lib/userUtils";
import { redirect } from "next/navigation";
import { getRSAStatistics } from "@/db/apiRoutes";
import { processStatisticsData } from "@/lib/processStatisticsData";
import useLocalStorage from "src/hook/useLocalStorage";
import { Experiment, LoginUser, RSAStatType } from "src/types";
import { useEffect } from "react";
import { useFetchTwoTypesRequests } from "src/hook/useFetchTwoTypesRequests";

export default function DashboardPage() {
  const [user, setUser] = useLocalStorage<LoginUser | null>("user", null);

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedUser = await getSignedUser();
      if (!fetchedUser) {
        redirect("/login");
      }
      setUser(fetchedUser);
    };
    fetchUser();
  }, [setUser]);

  const [statistics, setStatistics] = useLocalStorage<RSAStatType | null>("supervisorStatistics", null);

  useEffect(() => {
    const fetchStatistics = async () => {
      const statisticsResponse = await getRSAStatistics();
      if (statisticsResponse.success && statisticsResponse.data) {
        setStatistics(statisticsResponse.data);
      }
    };
    fetchStatistics();
  }, [setStatistics]);

  const { requestsData, chemicalsData, last3Months } = statistics
    ? processStatisticsData(statistics)
    : { requestsData: [], chemicalsData: [], last3Months: [] };

  // Fetch Requests
  const [pendingRequests, setPendingRequests] = useLocalStorage<Experiment[] | undefined>(
    `SupervisorPendingRequests`,
    undefined,
  );
  const [previousRequests, setPreviousRequests] = useLocalStorage<Experiment[] | undefined>(
    `SupervisorPreviousRequests`,
    undefined,
  );
  useFetchTwoTypesRequests(-1, setPendingRequests, setPreviousRequests);

  return (
    <main className="flex-grow bg-white p-8">
      <h2 className="mb-4 text-3xl font-bold">Hi {user?.name || ""}</h2>
      <p className="mb-8 text-xl">Welcome back to Flinders Chemical Ordering System</p>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <DashboardTile icon={FileText} title="Total Requests" data={requestsData} bgColor="bg-emerald-400" />
        <DashboardTile icon={TestTubes} title="Total Chemicals" data={chemicalsData} bgColor="bg-blue-500" />
      </div>

      <DashboardChart title="Request Statistics" data={last3Months} />
    </main>
  );
}
