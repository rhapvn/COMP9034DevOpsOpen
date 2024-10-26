import { ResearchErrorState, ResearchFormState } from "./useRecordChemStateAndError";
import { ChemicalData, Institute, Laboratory, ResearchCentre, StorageLocation } from "src/types";
import InputField from "@/components/InputField";
import { ChevronDown } from "lucide-react";
import { formatPlaceTag} from "@/lib/utils";
import SearchableSelectBox from "@/components/SearchableSelectBox";
import { placeTagEnum} from "@/db/schema";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Calendar
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type RecordChemicalsProps = {
  formState: ResearchFormState;
  errors: ResearchErrorState;
  setFormState: React.Dispatch<React.SetStateAction<ResearchFormState>>;
  setErrors: React.Dispatch<React.SetStateAction<ResearchErrorState>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeNames: Institute[] | ResearchCentre[] | Laboratory[];
  storageNames: StorageLocation[];
  chemicalNames: ChemicalData[];
};

const RecordChemicalsInputField: React.FC<RecordChemicalsProps> = ({
  formState,
  errors,
  setFormState,
  setErrors,
  handleInputChange,
  placeNames,
  storageNames,
  chemicalNames,
}) => {
  const placeTags = placeTagEnum.enumValues;

  return (
    <div className="mx-auto mt-6 flex max-w-5xl">

      <div className="flex w-[100%] flex-col gap-y-4">
      
        <div className="items-left h-[250px]"> 
          <label className="mb-2 block font-semibold text-black">Chemical</label>
          
          <Table className="rounded-tl-[10px] rounded-tr-[10px] overflow-hidden">
            <TableHeader>
              <TableRow className="bg-blue-600 pointer-events-none">
                <TableHead className="text-white text-left w-[35%] m-0">COMMON NAME</TableHead>
                <TableHead className="text-white text-left w-[35%] m-0 p-0">SYSTEMATIC NAME</TableHead>
                <TableHead className="text-white text-left w-[5%] m-0">QUANTITY</TableHead>
                <TableHead className="text-white text-left w-[25%]">RISK LEVEL</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          
          <div className="flex space-x-3 p-2 w-full">
            <SearchableSelectBox
              className="w-[125px]"
              name="commonName"
              options={chemicalNames.map((pName) => pName?.commonName || "")}
              placeholder="Type Common Name"
              icon={undefined}
              iconPosition={undefined}
              selected={chemicalNames.find((pName) => pName?.chemicalId === formState.chemicalId)?.commonName || ""}
              setSelected={(selectedName) => {
                const selectedChem = chemicalNames.find((pName) => pName?.commonName === selectedName);
                setFormState((prev) => ({
                  ...prev,
                  chemicalId: selectedChem?.chemicalId || undefined,
                  systematicName: selectedChem?.systematicName || "",
                  commonName: selectedChem?.commonName || "",
                  riskLevel: selectedChem?.riskLevel || undefined,
                  expiryPeriod: selectedChem?.expiryPeriod || undefined,
                }));
                setErrors((prev) => ({ ...prev, placeTagId: ""}));
              }}
              errorMsg={errors.commonName}
            />

            <InputField
              className="w-[145px]"
              name="systematicName"
              placeholder="Systematic Name"
              value={formState.systematicName || ""}
              onChange={handleInputChange}
              errorMsg={errors.systematicName}
              readOnly
            />

            <InputField
              className="w-[90px]"
              name="quantity"
              placeholder="Enter Quantity"
              value={formState.quantity || ""}
              onChange={handleInputChange}
              errorMsg={errors.quantity}
            />

            <InputField
                className="w-[80px] pointer-events-none"
                name="riskLevel"
                value={formState.riskLevel || ""}
                onChange={handleInputChange}
                errorMsg={errors.riskLevel}
            />
          </div>

        </div>

        
        <div className="mb-4 w-[500px] items-center"> 
          <label className="mb-2 block font-semibold text-black">Production Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[310px] justify-start text-left font-normal",
                  !formState.productionDate && "text-muted-foreground"
                )}
                name="productionDate"
              >
                <CalendarIcon className="mr-2 h-4 w-4"/>
                {formState.productionDate? format(formState.productionDate, "dd/MM/yyyy")
                : <span>Please Select The Production Date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formState.productionDate}
                onSelect={(selectedDate) =>
                  setFormState((prev) => ({
                    ...prev,
                    productionDate: selectedDate || undefined,
                  }))
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Display error message */}
          {errors?.productionDate && (<p className="mt-1 text-sm text-red-500">{errors.productionDate}</p>)}
        </div>

      </div>

      <div className="mt-5 ml-[10%] flex w-full flex-col justify-between">

        <div>
          <label className="mb-2 block text-sm font-medium">Place Tag</label>
          <div className={`flex space-x-4 ${errors.placeTag ? "border-red-500" : ""}`}>
            {placeTags.map((tag) => (
              <label key={tag} className="flex items-center">
                <input
                  type="radio"
                  name="placeTag"
                  value={tag}
                  checked={formState.placeTag === tag}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span>{formatPlaceTag(tag)}</span>
              </label>
            ))}
          </div>
          <div className="mt-1 h-5 text-sm text-red-500">{errors.placeTag || "\u00A0"}</div>
        </div>

        <SearchableSelectBox
          label="Place Name"
          options={placeNames.map((pName) => pName?.name || "")}
          placeholder="Choose Place Name"
          icon={<ChevronDown />}
          iconPosition="right"
          selected={placeNames.find((pName) => pName?.id === formState.placeTagId)?.name || ""}
          setSelected={(selectedName) => {
            const selectedPlace = placeNames.find((pName) => pName?.name === selectedName);
            setFormState((prev) => ({
              ...prev,
              placeTagId: selectedPlace?.id || undefined,
            }));
            setErrors((prev) => ({ ...prev, placeTagId: "" }));
          }}
          name="placeTagId"
          errorMsg={errors.placeTagId}
        />

        <SearchableSelectBox
          label="Storage Name"
          options={storageNames.map((pName) => pName?.storageName || "")}
          placeholder="Choose Storage Name"
          icon={<ChevronDown />}
          iconPosition="right"
          selected={storageNames.find((pName) => pName?.placeTagId === formState.placeTagId)?.storageName || ""}
          setSelected={(selectedName) => {
            const selectedStorage = storageNames.find((pName) => pName?.storageName === selectedName);
            setFormState((prev) => ({
              ...prev,
              storageId: selectedStorage?.storageId  || undefined,
              storageName: selectedStorage?.storageName || "",
            }));
            setErrors((prev) => ({ ...prev, storageId: "", storageName: "" }));
          }}
          name="storageName"
          errorMsg={errors.storageName}
        />

      </div>

    </div>
  );
};

export default RecordChemicalsInputField;
