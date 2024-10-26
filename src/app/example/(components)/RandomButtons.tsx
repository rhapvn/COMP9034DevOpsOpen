"use client";
import ButtonExample from "@/app/example/(components)/ButtonExample";
import { getRandom } from "../(functions)/getRandom";
import { useState } from "react";

const RandomButtons = () => {
  const [number, setNumber] = useState<number | "Random">("Random");
  const handleClick = () => {
    const number = getRandom();
    setNumber(number);
  };
  return (
    <div className="p-12">
      <div>Random Button component.</div>
      <div>This wraps the universal component ButtonExample.</div>
      <div className="space-x-4">
        <ButtonExample disabled={true}>{number}</ButtonExample>
        <ButtonExample onClick={handleClick} className="w-44">
          New Number
        </ButtonExample>
      </div>
    </div>
  );
};

export default RandomButtons;
