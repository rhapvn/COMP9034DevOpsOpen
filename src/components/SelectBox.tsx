"use client";

import React from "react";
import { cn } from "@/lib/utils";

type SelectBoxProps = {
  label?: string;
  options: Array<string>;
  placeholder?: string;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  selected: string;
  setSelected: (option: string) => void;
  name?: string;
  errorMsg?: string;
};

export default function SelectBox({
  label = "",
  options,
  placeholder = "Choose an option",
  className,
  icon,
  iconPosition = "left",
  selected,
  setSelected,
  name = label,
  errorMsg,
}: SelectBoxProps) {
  return (
    <div className={cn("items-center", className)}>
      {label && (
        <label className="mb-2 block font-semibold text-black" htmlFor={name}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={name}
          name={name}
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className={cn(
            "select",
            "h-10 w-full cursor-pointer appearance-none rounded-md border px-4 py-2 text-gray-700",
            "focus:outline-none focus:ring-2 focus:ring-blue-500",
            icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "",
            errorMsg
              ? "border-red-500 focus:border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:border-blue-500",
          )}
        >
          {placeholder && (
            <option value="" disabled className="hidden [.select:not(:focus)_&]:block">
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option key={index} value={option} className={option === selected ? "bg-gray-200" : ""}>
              {option}
            </option>
          ))}
        </select>
        {icon && (
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-400",
              iconPosition === "left" ? "left-3" : "right-3",
            )}
          >
            {icon}
          </div>
        )}
        {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>
          </svg>
        </div> */}
      </div>
      <div className="mt-1 h-5 text-sm text-red-500">{errorMsg || "\u00A0"}</div>
    </div>
  );
}
