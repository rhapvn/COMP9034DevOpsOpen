import React from "react";

type TitleLineProps = {
  name: string;
};

export default function TitleLine({ name }: TitleLineProps) {
  return (
    <div>
      <h1 className="my-2 text-center text-4xl font-semibold">{name}</h1>
      <hr className="mx-auto my-2 w-3/5 border-gray-400" />
    </div>
  );
}
