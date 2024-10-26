"use client";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useNewRequestState } from "./useNewRequestState";
import useTable from "@/components/tableParts/useTable";
import TitleLine from "@/components/TitleLine";
import InputField from "@/components/InputField";
import MiniTable from "@/components/tableParts/MiniTable";
import SearchableSelectBox from "@/components/SearchableSelectBox";
import { getSignedUser } from "@/lib/userUtils";
import { getUserById, getChemicalData, addExperiment } from "@/db/apiRoutes";
import { User, ChemicalData, ChemicalStock } from "src/types";
import { CirclePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateField } from "@/lib/validateField";
import { AddedChemicalColumns } from "@/components/tableParts/columns/AddedChemicalColumns";
import CustomModal, { closeModalBaseProps, errorModalBaseProps, initialModalProps } from "@/components/CustomModal";

const NewOrderPage: React.FC = () => {
  const router = useRouter();
  const { formState, setFormState, errors, setErrors, handleInputChange } = useNewRequestState();
  const [user, setUser] = useState<User | null>(null);
  const [chemicals, setChemicals] = useState<ChemicalData[]>([]);
  const [selectedChemical, setSelectedChemical] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [quantityError, setQuantityError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState(initialModalProps);

  const { table } = useTable({
    data: formState.addedChemicals,
    columns: AddedChemicalColumns(setFormState),
  });

  const navigateToResearcher = () => {
    router.push("/researcher");
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const requestDetails = {
        experimentDetails: formState.experimentDetails,
        isRiskAssessmentDone: formState.riskAssessment,
        highestRiskLevel: Math.max(...formState.addedChemicals.map((c) => c.riskLevel)),
        placeTagId: user?.placeTagId,
        experimentEndDate: formState.experimentEndDate,
      };

      const chemicalItems = formState.addedChemicals.map((chemical) => ({
        chemicalId: chemical.chemicalId,
        quantity: chemical.quantity,
      }));

      const result = await addExperiment(requestDetails, chemicalItems);

      if (result.success) {
        setModalState({
          ...closeModalBaseProps,
          description: "Experiment request submitted successfully!",
          onClose: () => router.push("/researcher/view_requests"),
        });
      } else {
        console.log("error");

        setModalState({
          ...errorModalBaseProps,
          description: result.message || "Error submitting experiment request",
          onAction: () => handleSubmit(),
          onClose: () => {
            setModalState((prev) => ({ ...prev, isOpen: false }));
          },
        });
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      setModalState({
        ...errorModalBaseProps,
        description: "An unexpected error occurred. Please try again.",
        onAction: () => handleSubmit(),
        onClose: () => {
          setModalState((prev) => ({ ...prev, isOpen: false }));
        },
      });
    } finally {
      console.log("finally");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const signedUser = await getSignedUser();
      if (signedUser) {
        const id = parseInt(signedUser.id);
        const userResponse = await getUserById(id);
        if (userResponse.success) {
          setUser(userResponse.data);
        }
      }
      const chemicalsResponse = await getChemicalData();
      if (chemicalsResponse.success) {
        setChemicals(chemicalsResponse.data);
      }
    };
    fetchData();
  }, []);

  const handleQuantityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuantity(value);
    const error = validateField("quantity", value);
    setQuantityError(error);
  };

  const handleAddChemical = () => {
    if (!selectedChemical || !quantity || quantityError) {
      return;
    }

    const chemical = chemicals.find((c) => c.commonName === selectedChemical);
    if (chemical) {
      setFormState((prev) => ({
        ...prev,
        addedChemicals: [
          ...prev.addedChemicals,
          {
            id: prev.addedChemicals.length + 1,
            chemicalId: chemical.chemicalId,
            commonName: chemical.commonName,
            systematicName: chemical.systematicName,
            quantity: parseFloat(quantity),
            riskLevel: chemical.riskLevel,
          },
        ],
      }));
      setErrors((prev) => ({ ...prev, addedChemicals: "" }));
      setSelectedChemical("");
      setQuantity("");
    }
  };
  console.log(modalState);
  return (
    <div className="mx-4">
      <TitleLine name="Make Request" />
      <div className="mt-12 grid grid-cols-2 gap-8">
        <div className="space-y-8">
          <InputField
            label="Experiment Details"
            name="experimentDetails"
            value={formState.experimentDetails}
            onChange={handleInputChange}
            className="w-full"
            errorMsg={errors.experimentDetails}
          />
          <InputField label="Laboratory" value={user?.placeTagName || ""} disabled className="w-full" />
          <div className="mt-4">
            <label className="mb-2 block font-semibold text-black">Experiment End Date</label>
            <input
              type="date"
              name="experimentEndDate"
              value={formState.experimentEndDate ? formState.experimentEndDate.toISOString().split("T")[0] : ""}
              onChange={handleInputChange}
              className={cn(
                "w-full rounded border p-2",
                "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200",
              )}
            />
            {errors.experimentEndDate && <p className="mt-1 text-sm text-red-500">{errors.experimentEndDate}</p>}
          </div>

          <div className="mb-4 mt-8 w-1/2">
            <label className="mb-2 flex cursor-pointer items-center font-semibold text-black">
              Risk Assessment
              <input
                type="checkbox"
                checked={formState.riskAssessment}
                onChange={(e) => setFormState((prev) => ({ ...prev, riskAssessment: e.target.checked }))}
                className="ml-4 mr-2 h-5 w-5 cursor-pointer"
              />
            </label>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <label className="mb-2 block font-semibold text-black">Chemical List</label>
            <MiniTable table={table} />
            {errors.addedChemicals && <p className="mt-1 text-sm text-red-500">{errors.addedChemicals}</p>}
          </div>
          <div className="space-y-4">
            <div className="flex items-end space-x-4">
              <SearchableSelectBox
                label="Select Chemical"
                options={chemicals.map((c) => c.commonName)}
                selected={selectedChemical}
                setSelected={setSelectedChemical}
                className="w-full"
              />
              <InputField
                label="Quantity"
                name="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-32"
                errorMsg={quantityError}
              />
            </div>
            <div className="flex justify-center">
              <button
                onClick={handleAddChemical}
                className={cn(
                  "flex h-10 w-1/2 items-center justify-center rounded-md bg-green-button px-6 font-semibold text-white transition-colors duration-300 hover:bg-green-600",
                  "disabled:bg-gray-300 disabled:text-gray-500",
                )}
                disabled={!selectedChemical || !quantity || quantityError ? true : false}
              >
                <CirclePlus />
                <p className="pl-[5px]">Add New Chemical</p>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-20 mt-20 flex justify-center space-x-6">
        <button className="mr-36 w-28 rounded bg-rose-500 px-4 py-2 text-white" onClick={navigateToResearcher}>
          Cancel
        </button>
        <button
          className="w-28 rounded bg-emerald-500 px-4 py-2 text-white"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
      <CustomModal {...modalState} />
    </div>
  );
};

export default NewOrderPage;
