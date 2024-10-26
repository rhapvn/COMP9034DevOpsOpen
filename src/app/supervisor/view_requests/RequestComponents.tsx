"use client";

import { useEffect, useState } from "react";
import { Experiment, ExperimentDetailsWithLab, LoginUser } from "src/types";
import { RequestColumns } from "@/components/tableParts/columns/RequestColumns";
import { useFetchTwoTypesRequests } from "src/hook/useFetchTwoTypesRequests";
import { DataTable } from "@/components/DataTable";
import TitleLine from "@/components/TitleLine";
import SharedRequestDetails from "./RequestDetails";
import { Button } from "@/components/CustomButton";
import useLocalStorage from "src/hook/useLocalStorage";
import { getRequestsDetailsByUserC } from "@/db/apiRoutes"; // Updated import
import { initialExperimentDetails } from "@/app/storage/view_requests/initialExperimentDetail";
import Spinner from "@/components/Spinner";
import { revalidateTag } from "next/cache";

const SharedRequestComponents = ({ user }: { user: LoginUser }) => {
  const [requestId, setRequestId] = useState(-1);
  const [showPending, setShowPending] = useState(true);
  const role = user.role;
  const [pendingRequests, setPendingRequests] = useLocalStorage<Experiment[] | undefined>(
    `${role}PendingRequests`,
    undefined,
  );
  const [previousRequests, setPreviousRequests] = useLocalStorage<Experiment[] | undefined>(
    `${role}PreviousRequests`,
    undefined,
  );
  const [requestsDetails, setRequestsDetails] = useLocalStorage<ExperimentDetailsWithLab[]>(
    `SupervisorRequestsDetails`,
    [],
  );

  useFetchTwoTypesRequests(requestId, setPendingRequests, setPreviousRequests);
  const fetchRequestsDetails = async () => {
    const res = await getRequestsDetailsByUserC(user);
    if (res.success && res.data) {
      setRequestsDetails(res.data.map((detail) => (detail ? detail : initialExperimentDetails)));
      console.log("Fetching Requests Details", res.data);
    }
  };

  useEffect(() => {
    console.log("Fetching Requests Details useEffect");
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
            {!requests ? <Spinner /> : <DataTable columns={columns} data={requests ?? []} />}
          </div>
        </>
      ) : (
        <>
          <TitleLine name="Request Details" />
          <SharedRequestDetails
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

export default SharedRequestComponents;
