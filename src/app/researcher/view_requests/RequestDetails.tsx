import InputField from "@/components/InputField";
import { AddedChemicalColumns } from "@/components/tableParts/columns/AddedChemicalColumns";
import MiniTable from "@/components/tableParts/MiniTable";
import { useEffect, useState } from "react";
import { ExperimentDetailsWithLab, LoginUser } from "src/types";
import { getLatestAction } from "@/lib/getLatestAction";
import UseTable from "@/components/tableParts/useTable";
import { STATUS_COLOR } from "@/lib/statusColor";
import Spinner from "@/components/Spinner";
import { statusDisplayActionJudge } from "../../../lib/statusDisplayActionJudge";
import TextAreaField from "@/components/TextAreaField";
import { initialExperimentDetails } from "@/app/storage/view_requests/initialExperimentDetail";

type RequestDetailsProps = {
  requestId: number;
  setRequestId: (id: number) => void;
  requestsDetails: ExperimentDetailsWithLab[];
  user: LoginUser;
};

const ResearcherRequestDetails = ({ requestId, setRequestId, requestsDetails, user }: RequestDetailsProps) => {
  const [request, setRequest] = useState<ExperimentDetailsWithLab>(initialExperimentDetails);

  useEffect(() => {
    const currentRequest = requestsDetails.find((r) => r.experimentDetails.experimentId === requestId);
    if (currentRequest) {
      setRequest(currentRequest);
    }
  }, [requestId, requestsDetails]);

  const { latestDate, latestUserName, latestComment } = getLatestAction(request);

  const { table } = UseTable({
    data: request?.chemicalList || [],
    columns: AddedChemicalColumns(),
  });

  const handleWithdraw = () => {
    console.log("withdraw coming soon..");
  };

  const details = request?.experimentDetails;
  const status = details?.status;
  const { displayStatus, byWhoResearcher } = statusDisplayActionJudge(status, user.role);
  const statusColor = STATUS_COLOR[displayStatus.toLowerCase() as keyof typeof STATUS_COLOR] || "text-black";
  const dateValue = status == "submitted" ? "Waiting..." : latestDate ? new Date(latestDate).toLocaleDateString() : ""

  return (
    <div className="mt-12 grid grid-cols-2 gap-8">
      <div>
        <InputField label="Experiment Details" value={details?.experimentDetails || ""} disabled className="w-full" />
        <InputField
          label="Request Date"
          value={details?.submissionDate ? new Date(details.submissionDate).toLocaleDateString() : ""}
          disabled
          className="w-full"
        />
        <InputField
          label="Experiment End Date"
          value={details?.experimentEndDate ? new Date(details.experimentEndDate).toLocaleDateString() : ""}
          disabled
          className="w-full"
        />
        <InputField label="Laboratory" value={request?.lab?.name || ""} disabled className="w-full" />

        <InputField
          label={`${status == "rejected" ? "Rejected" : "Approval"} Date`}
          value={dateValue}
          disabled
          className="w-full"
        />
        <InputField id="by" label={byWhoResearcher} value={latestUserName || ""} disabled className="w-full" />
        <TextAreaField label="Comment" value={latestComment || ""} className="w-full" rows={4} disabled />
        <div className="flex items-center justify-between">
          <div className="mb-4 w-1/2">
            <label className="mb-2 flex items-center font-semibold text-black">
              Risk Assessment
              <input
                type="checkbox"
                checked={details?.isRiskAssessmentDone}
                disabled
                className="ml-4 mr-2 h-5 w-5 cursor-none"
              />
            </label>
          </div>
          <div className="mb-4 flex w-1/2">
            <label className="mb-2 mr-6 flex items-center font-semibold text-black">Status</label>
            <div className={`w-full font-bold ${statusColor}`}>{displayStatus || ""}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className="mb-4">
          <label className="mb-2 block font-semibold text-black">Chemical List</label>
          <MiniTable table={table} className="h-[500px] max-h-[500px]" />
        </div>
        <div className="flex justify-between">
          <button className="z-10 w-36 rounded bg-blue-600 px-4 py-2 text-white" onClick={() => setRequestId(-1)}>
            Back
          </button>

          <button
            className="w-36 rounded bg-red-600 px-4 py-2 text-white disabled:bg-slate-300 invisible"
            disabled
            onClick={handleWithdraw}
          >
            Withdraw
          </button>
        </div>
      </div>
      {!request.experimentDetails.status && (
        <div className="absolute flex h-3/4 w-3/4 items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default ResearcherRequestDetails;
