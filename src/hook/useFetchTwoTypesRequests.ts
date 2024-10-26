import { getPendingRequests, getPreviousRequests } from "@/db/apiRoutes";
import { useEffect } from "react";
import { Experiment } from "src/types";

interface Request {
  // Define the structure of your request object here
}

export const useFetchTwoTypesRequests = (
  requestId: number,
  setPendingRequests: React.Dispatch<React.SetStateAction<Experiment[] | undefined>>,
  setPreviousRequests: React.Dispatch<React.SetStateAction<Experiment[] | undefined>>,
) => {
  useEffect(() => {
    if (requestId === -1) {
      const fetchData = async () => {
        try {
          const [pending, previous] = await Promise.all([getPendingRequests(), getPreviousRequests()]);
          setPendingRequests(pending.data);
          setPreviousRequests(previous.data);
        } catch (error) {
          console.error("Failed to fetch requests:", error);
        }
        console.log("Requests done");
      };
      fetchData();
    }
  }, [requestId, setPendingRequests, setPreviousRequests]);
};
