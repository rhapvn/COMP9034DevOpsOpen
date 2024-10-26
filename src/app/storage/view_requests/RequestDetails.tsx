import UseTable from "@/components/tableParts/useTable";
import TextAreaField from "@/components/TextAreaField";
import { useEffect, useState } from "react";
import {
  AddedChemicalData,
  AssignedChemicalData,
  ChemicalInChemicalList,
  ChemicalStock,
  ExperimentDetailsWithLab,
  ExperimentWithName,
  LoginUser,
} from "src/types";
import { getAvailableChemicalsInStockC, approveOrRejectRequest, getPendingRequests, getAvailableChemicalsInStock } from "@/db/apiRoutes";
import Spinner from "@/components/Spinner";
import CustomModal, { closeModalBaseProps, errorModalBaseProps, initialModalProps } from "@/components/CustomModal";
import { RequestDetailsUI } from "./RequestDetailsUI";
import { AssignedChemicalColumns } from "@/components/tableParts/columns/AssignedChemicalColumns";
import { Table } from "@tanstack/react-table";
import { statusDisplayActionJudge } from "@/lib/statusDisplayActionJudge";
import { initialExperimentDetails } from "./initialExperimentDetail";
import useLocalStorageFetch from "src/hook/useLocalStorageFetch";
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

const StorageRequestDetails = ({
  requestId,
  setRequestId,
  requestsDetails,
  user,
  setPendingRequests,
  fetchRequestsDetails
}: RequestDetailsProps) => {
  const [request, setRequest] = useState<ExperimentDetailsWithLab>(initialExperimentDetails);
  const [comment, setComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalState, setModalState] = useState(initialModalProps);
  const [allChemicalsData, setAllChemicalsData] = useLocalStorageFetch<ChemicalStock[]>(
    `StorageSearchStock`,
    [],
    getAvailableChemicalsInStock,
  );
  const [shouldFetchPending, setShouldFetchPending] = useState(false);
  console.log("RequestDetails", requestsDetails);

  const assignChemical = (assignedChemicalId: number, stockId: number) => {
    const chemicalData = allChemicalsData.find((chemical) => chemical.stockId === stockId);
    const pickupStorage = chemicalData?.storageName || "";
    const placeName = chemicalData?.placeName || "";

    setRequest((prevRequest) => {
      if (!prevRequest) return prevRequest;
      const updatedChemicalList = prevRequest.chemicalList.map((chemical) => {
        if (chemical.id === assignedChemicalId) {
          return { ...chemical, stockId, pickupStorage, placeName };
        }
        return chemical;
      });
      return { ...prevRequest, chemicalList: updatedChemicalList };
    });
  };

  useEffect(() => {
    if (shouldFetchPending) {
      const fetchPendingRequests = async () => {
        try {
          const pending = await getPendingRequests();
          setPendingRequests(pending.data);
        } catch (error) {
          console.error("Error fetching pending requests:", error);
        } finally {
          setShouldFetchPending(false);
        }
      };

      fetchPendingRequests();
    }
  }, [shouldFetchPending, setPendingRequests]);

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
            fetchRequestsDetails()
          },
        });
      } else {
        setModalState({
          ...errorModalBaseProps,
          title: "Error",
          description: response.message || "Failed to reject request",
          onClose: () => {
            setModalState((prev) => ({ ...prev, isOpen: false }));
          },
        });
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      setModalState({
        ...errorModalBaseProps,
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        onClose: () => {
          setModalState((prev) => ({ ...prev, isOpen: false }));
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!requestId || !request) return;
    setIsLoading(true);

    try {
      const mappedChemicalList = request.chemicalList.map((chemical: ChemicalInChemicalList) => ({
        id: chemical.id,
        experimentId: chemical.experimentId,
        chemicalId: chemical.chemicalId,
        stockId: chemical.stockId,
        quantity: chemical.quantity,
      }));

      const response = await approveOrRejectRequest({
        experimentId: requestId,
        status: "procured",
        comments: comment,
        assignedPickUpStorage: mappedChemicalList,
      });

      if (response.success) {
        setShouldFetchPending(true);
        setModalState({
          ...closeModalBaseProps,
          title: "Success",
          description: `Request approved successfully`,
          onClose: () => {
            setModalState(initialModalProps);
            setRequestId(-1);
            fetchRequestsDetails()
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

  useEffect(() => {
    const initialFromProps = requestsDetails.find((r) => r.experimentDetails.experimentId === requestId);
    if (initialFromProps) {
      setRequest(initialFromProps);
    }
  }, [requestId, requestsDetails]);

  const status = request?.experimentDetails?.status;
  const { isActionNeeded } = statusDisplayActionJudge(status, user.role);

  const { table } = UseTable({
    data: (request?.chemicalList as AssignedChemicalData[]) || [],
    columns: AssignedChemicalColumns(assignChemical, allChemicalsData, isActionNeeded),
  });

  return (
    <div className="mt-12 grid grid-cols-2 gap-8">
      <RequestDetailsUI
        request={request}
        table={table as Table<ChemicalStock | AssignedChemicalData | ChemicalInChemicalList | AddedChemicalData>}
      >
        <TextAreaField
          label="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={cn("w-full resize-none", !isActionNeeded && "invisible")}
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
      {!request.experimentDetails.status && (
        <div className="absolute flex h-3/4 w-3/4 items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default StorageRequestDetails;
