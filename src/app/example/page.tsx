"use client";
import { MemberList } from "@/app/example/(components)/MemberList";
import { ChangeEvent, Suspense, useState } from "react";
import StackList from "./(components)/StackList";
import RandomButtons from "./(components)/RandomButtons";
import SearchableSelectBox from "@/components/SearchableSelectBox";
import InputField from "@/components/InputField";
import SelectBox from "@/components/SelectBox";
import {
  AiFillExperiment,
  AiOutlineUser,
  AiOutlineIdcard,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineTeam,
} from "react-icons/ai";

const chemicalOptions = [
  "Hydrochloric Acid",
  "Sodium Hydroxide",
  "Sulfuric Acid",
  "Ethanol",
  "Acetone",
  "Methanol",
  "Hydrogen Peroxide",
  "Nitric Acid",
  "Acetic Acid",
  "Ammonia",
];

const deviceOptions = [
  "Bunsen Burner",
  "Microscope",
  "Centrifuge",
  "Spectrophotometer",
  "pH Meter",
  "Distillation Apparatus",
  "Titration Burette",
  "Analytical Balance",
  "Pipette",
  "Fume Hood",
];

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  chemical1: string;
  chemical2: string;
  chemical3: string;
  chemical4: string;
  chemical5: string;
  device1: string;
  device2: string;
  device3: string;
}

const initialFormState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  role: "",
  chemical1: "",
  chemical2: "",
  chemical3: "",
  chemical4: "",
  chemical5: "",
  device1: "",
  device2: "",
  device3: "",
};

const ExamplePage = () => {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [showModal, setShowModal] = useState(false);

  const handleOnChange = (name: string) => (e: ChangeEvent<HTMLInputElement> | string) => {
    setFormState((prev) => ({
      ...prev,
      [name]: typeof e === "string" ? e : e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="flex w-full max-w-4xl flex-col items-center justify-center bg-white p-8 shadow-lg shadow-blue-600">
      <div className="w-full">
        <div>example/page.tsx</div>
      </div>
      <div className="flex h-20 items-center justify-center text-3xl">COMP9034DevOps Team4 Demo</div>

      <div className="mb-2 w-full border-b-2 border-blue-300 pl-12 text-2xl">Simple input</div>
      <div className="grid w-full max-w-2xl grid-cols-2 gap-4">
        <InputField
          label="First Name"
          placeholder="Enter First Name"
          icon={<AiOutlineUser />}
          value={formState.firstName}
          onChange={handleOnChange("firstName")}
        />
        <InputField
          label="Last Name"
          placeholder="Enter Last Name"
          icon={<AiOutlineIdcard />}
          value={formState.lastName}
          onChange={handleOnChange("lastName")}
        />
        <InputField
          label="Email"
          placeholder="Enter Email"
          icon={<AiOutlineMail />}
          value={formState.email}
          onChange={handleOnChange("email")}
        />
        <InputField
          label="Phone"
          placeholder="Enter Phone"
          icon={<AiOutlinePhone />}
          value={formState.phone}
          onChange={handleOnChange("phone")}
        />
        <InputField
          label="Role"
          placeholder="Enter Role"
          icon={<AiOutlineTeam />}
          value={formState.role}
          onChange={handleOnChange("role")}
        />
      </div>

      <div className="mb-2 w-full border-b-2 border-blue-300 pl-12 text-2xl">Searchable Select Box</div>
      <div className="mt-4 grid w-full max-w-2xl grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <SearchableSelectBox
            key={num}
            options={chemicalOptions}
            className="w-full"
            selected={formState[`chemical${num}` as keyof FormState]}
            setSelected={(value) => handleOnChange(`chemical${num}`)(value)}
            label={`Chemical ${num}`}
          />
        ))}
      </div>

      <div className="mb-2 w-full border-b-2 border-blue-300 pl-12 text-2xl">Simple Select Box</div>
      <div className="mt-4 grid w-full max-w-2xl grid-cols-2 gap-4">
        {[1, 2, 3].map((num) => (
          <SelectBox
            key={num}
            options={deviceOptions}
            className="w-full"
            selected={formState[`device${num}` as keyof FormState]}
            setSelected={(value) => handleOnChange(`device${num}`)(value)}
            label={`Device ${num}`}
            icon={<AiFillExperiment />}
          />
        ))}
      </div>

      <button onClick={handleSubmit} className="mt-6 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        Submit
      </button>

      <div className="h-36"></div>
      <StackList />

      {/* <Suspense fallback={<div>Loading...</div>}>
        <MemberList />
      </Suspense> */}

      <RandomButtons />

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={closeModal}
        >
          <div
            className="max-h-[80vh] w-[80vw] max-w-2xl overflow-auto rounded-lg bg-white p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-2xl font-bold">Form State</h2>
            <pre className="whitespace-pre-wrap">{JSON.stringify(formState, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamplePage;
