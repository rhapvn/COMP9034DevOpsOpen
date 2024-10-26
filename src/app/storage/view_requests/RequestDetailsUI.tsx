import InputField from "@/components/InputField";
import MiniTable from "@/components/tableParts/MiniTable";
import TextAreaField from "@/components/TextAreaField";
import { getLatestAction } from "@/lib/getLatestAction";
import { STATUS_COLOR } from "@/lib/statusColor";
import { Table } from "@tanstack/react-table";
import {
  AddedChemicalData,
  AssignedChemicalData,
  ChemicalInChemicalList,
  ChemicalStock,
  ExperimentDetails,
  ExperimentDetailsWithLab,
  Laboratory,
} from "src/types";

type RequestDetailsUIProps = {
  request: ExperimentDetailsWithLab | undefined;
  children: React.ReactNode;
  table: Table<AddedChemicalData | ChemicalStock | ChemicalInChemicalList | AssignedChemicalData>;
};

export const RequestDetailsUI = ({ request, children, table }: RequestDetailsUIProps) => {
  const statusColor = STATUS_COLOR[request?.experimentDetails.status as keyof typeof STATUS_COLOR] || "text-black";
  const details = request?.experimentDetails;
  const { latestDate, latestUserName, latestComment } = getLatestAction(request);
  const status = details?.status;
  const statusCapitalized = status ? status.charAt(0).toUpperCase() + status.slice(1) : "";

  return (
    <>
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
        <InputField label="Laboratory" value={request?.lab?.name || "loading..."} disabled className="w-full" />
        <InputField label={`Researcher`} value={details?.submittedUserName || ""} disabled className="w-full" />

        {details?.firstApprovalTime && (
          <>
            <InputField
              label={`${statusCapitalized} Date`}
              value={latestDate ? new Date(latestDate).toLocaleDateString() : ""}
              disabled
              className="w-full"
            />
            <InputField label={`${statusCapitalized} by`} value={latestUserName || ""} disabled className="w-full" />
            <TextAreaField label="Comment" value={latestComment || ""} className="w-full" rows={4} disabled />
          </>
        )}

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

            <div className={`w-full font-bold ${statusColor}`}>{statusCapitalized || ""}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className="">
          <label className="mb-2 block font-semibold text-black">Chemical List</label>
          <MiniTable table={table} className="h-[500px] max-h-[500px]" />
        </div>
        {children}
      </div>
    </>
  );
};

export default RequestDetailsUI;
