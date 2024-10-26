"use client";

import { useEffect, useState } from "react";
import {
  Experiment,
  ExperimentDetails,
  ExperimentDetailsWithLab,
  ExperimentWithName,
  Laboratory,
  LoginUser,
} from "src/types";
import { RequestColumns } from "@/components/tableParts/columns/RequestColumns";
import { useFetchTwoTypesRequests } from "src/hook/useFetchTwoTypesRequests";
import StorageRequestDetails from "./RequestDetails";
import { DataTable } from "@/components/DataTable";
import TitleLine from "@/components/TitleLine";
import { Button } from "@/components/CustomButton";
import useLocalStorage from "src/hook/useLocalStorage";
import { getRequestById, getLabById, getRequestsDetailsByUserC } from "@/db/apiRoutes";
import { initialExperimentDetails } from "./initialExperimentDetail";

const StorageRequestComponents = ({ user }: { user: LoginUser }) => {
  const [requestId, setRequestId] = useState(-1);
  const [showPending, setShowPending] = useState(true);
  const [pendingRequests, setPendingRequests] = useLocalStorage<Experiment[] | undefined>(
    `StoragePendingRequests`,
    undefined,
  );
  const [previousRequests, setPreviousRequests] = useLocalStorage<Experiment[] | undefined>(
    `StoragePreviousRequests`,
    undefined,
  );
  const [requestsDetails, setRequestsDetails] = useLocalStorage<ExperimentDetailsWithLab[]>(`StorageRequestsDetails`, []);
  const [isFetching, setIsFetching] = useState(false);

  useFetchTwoTypesRequests(requestId, setPendingRequests, setPreviousRequests);

  const fetchRequestsDetails = async () => {
    if (isFetching) return;
    setIsFetching(true);
    console.time("fetchRequestsDetails");

    try {
      const res = await getRequestsDetailsByUserC(user);
      if (res.success && res.data) {
        setRequestsDetails(res.data.map((detail) => (detail ? detail : initialExperimentDetails)));
      }
    } catch (error) {
      console.error("Error fetching request details:", error);
      setIsFetching(false);
      console.timeEnd("fetchRequestsDetails");
    }
  };

  useEffect(() => {
    fetchRequestsDetails();

  }, [user, setRequestsDetails]);

  const columns = RequestColumns(setRequestId);
  const requests = showPending ? pendingRequests : previousRequests;

  return (
    <div className="mx-4">
      {requestId === -1 ? (
        <>
          <TitleLine name="View Requests" />
          <div className="container relative mx-auto">
            <Button
              variant={showPending ? "button" : "submit"}
              onClick={() => setShowPending(!showPending)}
              className="absolute right-20 top-4 z-10"
            >
              {showPending ? "Show Previous" : "Show Pending"}
            </Button>
            <DataTable columns={columns} data={requests ?? []} />
          </div>
        </>
      ) : (
        <>
          <TitleLine name="Request Details" />
          <StorageRequestDetails
            requestId={requestId}
            setRequestId={setRequestId}
            requestsDetails={requestsDetails}
            user={user}
            setPendingRequests={setPendingRequests}
            fetchRequestsDetails={fetchRequestsDetails}
          />
        </>
      )}
    </div>
  );
};

export default StorageRequestComponents;
