import React from "react";
import { CirclePlus } from "lucide-react";
import Link from "next/link";

type AddNewButtonProps = {
  type?: string;
  href?: string;
};

export default function AddNewButton({ type, href }: AddNewButtonProps) {
  if (!type) return <></>;
  const ButtonContent = (
    <button className="flex h-10 min-w-48 items-center rounded-md bg-green-button px-6 font-semibold text-white transition-colors duration-300 hover:bg-green-600">
      <CirclePlus />
      <p className="pl-[5px]">Add New {type}</p>
    </button>
  );

  return href ? <Link href={href}>{ButtonContent}</Link> : ButtonContent;
}
