"use client";

import TitleLine from "@/components/TitleLine";
import { useEffect, useState } from "react";
import ResearcherRequestDetails from "./RequestDetails";
import Spinner from "@/components/Spinner";
import { DataTable } from "@/components/DataTable";
import { RequestResearcherColumns } from "@/components/tableParts/columns/RequestResearcherColumns";
import { getPreviousRequests, getRequestsDetailsByUserC } from "@/db/apiRoutes";
import { Experiment, ExperimentDetailsWithLab, LoginUser } from "src/types";
import useLocalStorage from "src/hook/useLocalStorage";
import { initialExperimentDetails } from "@/app/storage/view_requests/initialExperimentDetail";

type RequestComponentsProps = {
  user: LoginUser;
};

const ResearcherRequestComponents = ({ user }: RequestComponentsProps) => {
  const [requestId, setRequestId] = useState(-1);
  const [requests, setRequests] = useLocalStorage<Experiment[] | undefined>("researcherRequests", undefined);
  const [requestsDetails, setRequestsDetails] = useLocalStorage<ExperimentDetailsWithLab[]>(
    `ResearcherRequestsDetails`,
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPreviousRequests();
      if (response.success) {
        setRequests(response.data);
      } else {
        console.error("Failed to fetch previous requests:", response.message);
      }
    };
    fetchData();
  }, [setRequests]);

  useEffect(() => {
    const fetchRequestsDetails = async () => {
      if (!requests) return;
      const res = await getRequestsDetailsByUserC(user);
      if (res.success && res.data) {
        setRequestsDetails(res.data.map((detail) => (detail ? detail : initialExperimentDetails)));
      }
    };
    fetchRequestsDetails();
  }, [requests, user, setRequestsDetails]);

  const columns = RequestResearcherColumns(setRequestId);

  return (
    <div className="mx-4">
      {requestId === -1 ? (
        <>
          <TitleLine name="View Requests" />
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={requests ?? []} />
          </div>
        </>
      ) : (
        <>
          <TitleLine name="Request Details" />
          <ResearcherRequestDetails
            requestId={requestId}
            setRequestId={setRequestId}
            requestsDetails={requestsDetails}
            user={user}
          />
        </>
      )}
    </div>
  );
};

export default ResearcherRequestComponents;
