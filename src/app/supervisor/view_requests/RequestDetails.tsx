import { AddedChemicalColumns } from "@/components/tableParts/columns/AddedChemicalColumns";
import UseTable from "@/components/tableParts/useTable";
import TextAreaField from "@/components/TextAreaField";
import { useState, useEffect } from "react";
import { ExperimentDetailsWithLab, ExperimentWithName, LoginUser } from "src/types";
import { approveOrRejectRequest, getPendingRequests } from "@/db/apiRoutes";
import CustomModal, { closeModalBaseProps, errorModalBaseProps, initialModalProps } from "@/components/CustomModal";
import RequestDetailsUI from "@/app/storage/view_requests/RequestDetailsUI";
import { statusDisplayActionJudge } from "@/lib/statusDisplayActionJudge";
import { initialExperimentDetails } from "@/app/storage/view_requests/initialExperimentDetail";
import { cn } from "@/lib/utils";
import { revalidateTag } from "next/cache";

type RequestDetailsProps = {
  requestId: number;
  setRequestId: (id: number) => void;
  requestsDetails: ExperimentDetailsWithLab[];
  user: LoginUser;
  setPendingRequests: React.Dispatch<React.SetStateAction<ExperimentWithName[] | undefined>>;
  fetchRequestsDetails: () => void;
};

const SharedRequestDetails = ({
  requestId,
  setRequestId,
  requestsDetails,
  user,
  setPendingRequests,
  fetchRequestsDetails,
}: RequestDetailsProps) => {
  const initialFromProps = requestsDetails.find((r) => r.experimentDetails.experimentId === requestId);
  const [request, setRequest] = useState<ExperimentDetailsWithLab>(initialFromProps || initialExperimentDetails);
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState(initialModalProps);
  const [shouldFetchPending, setShouldFetchPending] = useState(false);

  useEffect(() => {
    if (shouldFetchPending) {
      const fetchPendingRequests = async () => {
        try {
          const pending = await getPendingRequests();
          setPendingRequests(pending.data);
          console.log("Pending Requests", pending.data);
        } catch (error) {
          console.error("Error fetching pending requests:", error);
        } finally {
          setShouldFetchPending(false);
        }
      };

      fetchPendingRequests();
    }
  }, [shouldFetchPending, setPendingRequests]);

  console.log("Request", request);
  console.log("Request ID", requestId);
  console.log("shouldFetchPending", shouldFetchPending);

  const { table } = UseTable({
    data: request?.chemicalList || [],
    columns: AddedChemicalColumns(),
  });

  const handleReject = async () => {
    if (!requestId) return;
    setIsLoading(true);

    try {
      const response = await approveOrRejectRequest({
        experimentId: requestId,
        status: "rejected",
        comments: comment,
      });

      if (response.success) {
        setShouldFetchPending(true);
        setModalState({
          ...closeModalBaseProps,
          title: "Success",
          description: "Request rejected successfully",
          onClose: () => {
            setModalState(initialModalProps);
            setRequestId(-1);
            fetchRequestsDetails();
          },
        });
      } else {
        setModalState({
          ...errorModalBaseProps,
          title: "Error",
          description: response.message || "Failed to reject request",
        });
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      setModalState({
        ...errorModalBaseProps,
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!requestId || !request) return;
    setIsLoading(true);

    try {
      const riskLevel = request.experimentDetails.highestRiskLevel;
      if (!riskLevel) throw new Error("Risk level not found");
      const status = user.role == "supervisor" && riskLevel >= 4 ? "escalated" : "approved";

      const response = await approveOrRejectRequest({
        experimentId: requestId,
        status: status,
        comments: comment,
      });

      if (response.success) {
        setShouldFetchPending(true);
        setModalState({
          ...closeModalBaseProps,
          title: "Success",
          description: `Request ${status === "escalated" ? "approved and escalated" : "approved"} successfully`,
          onClose: () => {
            setModalState(initialModalProps);
            setRequestId(-1);
            fetchRequestsDetails();
          },
        });
      } else {
        setModalState({
          ...errorModalBaseProps,
          title: "Error",
          description: response.message || "Failed to approve request",
        });
      }
    } catch (error) {
      console.error("Error approving request:", error);
      setModalState({
        ...errorModalBaseProps,
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const status = request?.experimentDetails?.status;
  const { isActionNeeded } = statusDisplayActionJudge(status, user.role);

  return (
    <div className="mt-12 grid grid-cols-2 gap-8">
      <RequestDetailsUI request={request} table={table}>
        <TextAreaField
          label="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={cn("w-full", !isActionNeeded && "invisible")}
          rows={4}
          disabled={isLoading}
        />
        <div className="mb-6 flex justify-between">
          <button
            className="z-10 w-36 rounded bg-[#3758F9] text-neutral-100 hover:bg-[#1B44C8] active:bg-[#1B44C8]"
            onClick={() => setRequestId(-1)}
          >
            Close
          </button>

          <button
            className={cn(
              "w-36 rounded bg-red-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50",
              !isActionNeeded && "invisible",
            )}
            onClick={handleReject}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Reject"}
          </button>

          <button
            className={cn(
              "w-36 rounded bg-green-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50",
              !isActionNeeded && "invisible",
            )}
            onClick={handleApprove}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Approve"}
          </button>
        </div>
      </RequestDetailsUI>
      <CustomModal {...modalState} />
    </div>
  );
};

export default SharedRequestDetails;
