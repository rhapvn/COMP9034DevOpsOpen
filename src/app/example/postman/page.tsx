"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getUsers,
  getUserById,
  addUser,
  updateUserDetails,
  updateUserPersonalDetails,
  updateUserStatus,
  getInstitutes,
  addInstitute,
  updateInstitute,
  removeInstitute,
  getInstituteById,
  getResearchCentres,
  addResearchCentre,
  updateResearchCentre,
  removeResearchCentre,
  getResearchCentreById,
  getLabs,
  addLab,
  updateLab,
  removeLab,
  getLabById,
  getStorages,
  addStorage,
  updateStorage,
  removeStorage,
  getStorageById,
  getChemicalData,
  addChemicalData,
  updateChemicalData,
  removeChemicalData,
  getChemicalDataById,
  getAdminStatistics,
  getRSAStatistics,
  addExperiment,
  getPendingRequests,
  getPreviousRequests,
  getRequestById,
  approveOrRejectRequest,
  getChemicalStock,
  updateChemicalQuantity,
  disposeChemical,
  recordChemical,
  getChemicalListByStorageId,
  getChemicalDisposalByStorageId,
  getAvailableChemicalsInStock,
} from "@/db/apiRoutes";
import Spinner from "@/components/Spinner";
import { revalidateAllRequests } from "./revalidate";

const apiRoutes = {
  getUsers,
  getUserById,
  addUser,
  updateUserDetails,
  updateUserPersonalDetails,
  updateUserStatus,
  getInstitutes,
  addInstitute,
  updateInstitute,
  removeInstitute,
  getInstituteById,
  getResearchCentres,
  addResearchCentre,
  updateResearchCentre,
  removeResearchCentre,
  getResearchCentreById,
  getLabs,
  addLab,
  updateLab,
  removeLab,
  getLabById,
  getStorages,
  addStorage,
  updateStorage,
  removeStorage,
  getStorageById,
  getChemicalData,
  addChemicalData,
  updateChemicalData,
  removeChemicalData,
  getChemicalDataById,
  getAdminStatistics,
  getRSAStatistics,
  addExperiment,
  getPendingRequests,
  getPreviousRequests,
  getRequestById,
  approveOrRejectRequest,
  getChemicalStock,
  updateChemicalQuantity,
  disposeChemical,
  recordChemical,
  getChemicalListByStorageId,
  getChemicalDisposalByStorageId,
  getAvailableChemicalsInStock,
  revalidateAllRequests,
};

const functionInputs = {
  getUsers: [],
  getUserById: ["userId"],
  addUser: ["userData"],
  updateUserDetails: ["userDetails"],
  updateUserPersonalDetails: ["userDetails"],
  updateUserStatus: ["userId", "status"],
  getInstitutes: [],
  addInstitute: ["name", "address"],
  updateInstitute: ["instituteData"],
  removeInstitute: ["id"],
  getInstituteById: ["instituteId"],
  getResearchCentres: [],
  addResearchCentre: ["name", "instituteId"],
  updateResearchCentre: ["centreData"],
  removeResearchCentre: ["centreId"],
  getResearchCentreById: ["centreId"],
  getLabs: [],
  addLab: ["name", "centreId"],
  updateLab: ["labData"],
  removeLab: ["id"],
  getLabById: ["labId"],
  getStorages: [],
  addStorage: ["name", "capacity"],
  updateStorage: ["storageId", "data"],
  removeStorage: ["storageId"],
  getStorageById: ["storageId"],
  getChemicalData: [],
  addChemicalData: ["commonName", "systematicName"],
  updateChemicalData: ["chemicalId", "data"],
  removeChemicalData: ["id"],
  getChemicalDataById: ["chemicalId"],
  getAdminStatistics: [],
  getRSAStatistics: [],
  addExperiment: ["details"],
  getPendingRequests: [],
  getPreviousRequests: [],
  getRequestById: ["requestId"],
  approveOrRejectRequest: ["params"],
  getChemicalStock: [],
  updateChemicalQuantity: ["chemicalId", "quantity"],
  disposeChemical: ["chemicalId"],
  recordChemical: ["chemicalId", "data"],
  getChemicalListByStorageId: ["storageId"],
  getChemicalDisposalByStorageId: ["storageId"],
  getAvailableChemicalsInStock: [],
  revalidateAllRequests: [],
};

export default function Postman() {
  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [selectedFunction, setSelectedFunction] = useState(Object.keys(apiRoutes)[0]);
  const [functionInput, setFunctionInput] = useState(functionInputs[selectedFunction as keyof typeof functionInputs]);
  const [isLoading, setIsLoading] = useState(false);

  const handleExecute = async () => {
    setIsLoading(true);
    setOutput("");
    setError("");

    try {
      const func = apiRoutes[selectedFunction as keyof typeof apiRoutes];
      let parsedInput1, parsedInput2;

      try {
        parsedInput1 = eval(`(${input1})`);
      } catch {
        parsedInput1 = input1;
      }

      try {
        parsedInput2 = eval(`(${input2})`);
      } catch {
        parsedInput2 = input2;
      }

      const result = await func(parsedInput1, parsedInput2);

      setOutput(JSON.stringify(result, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFunctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFunction(e.target.value);
    setFunctionInput(functionInputs[e.target.value as keyof typeof functionInputs]);
    // setInput1("");
    // setInput2("");
  };

  return (
    <div className="container mx-auto h-screen p-4">
      <h1 className="mb-4 text-2xl font-bold">Function Tester</h1>
      <div className="flex w-1/2 items-start justify-between">
        <div className="mb-4 mt-4">
          <label className="">Select Function:</label>
          <select value={selectedFunction} onChange={handleFunctionChange} className="rounded border p-2">
            {Object.keys(apiRoutes).map((funcName) => (
              <option key={funcName} value={funcName}>
                {funcName}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={handleExecute}>Execute Function</Button>
      </div>
      <div className="flex space-x-4">
        <div className="w-1/2">
          <h2 className="mb-2 text-lg font-semibold">Input 1 ({functionInput[0]})</h2>
          <textarea
            className="h-32 w-full rounded border p-2"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            placeholder="Enter JavaScript value, object, or array"
            disabled={functionInput.length < 1}
            rows={8}
          />

          <h2 className="mb-2 mt-4 text-lg font-semibold">Input 2 ({functionInput[1]})</h2>
          <textarea
            className="h-32 w-full rounded border p-2"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            placeholder="Enter JavaScript value, object, or array"
            disabled={functionInput.length < 2}
            rows={8}
          />
        </div>
        <div className="h-[860px] w-1/2">
          <h2 className="mb-2 text-lg font-semibold">Output</h2>
          <pre className="h-full w-full overflow-auto rounded border bg-gray-100 p-2">
            {isLoading ? <Spinner /> : <></>}
            {error ? <span className="text-red-500">{error}</span> : output}
          </pre>
        </div>
      </div>
    </div>
  );
}
