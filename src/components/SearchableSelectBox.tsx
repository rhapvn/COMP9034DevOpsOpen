"use client";

import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

type SearchableSelectBoxProps = {
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

export default function SearchableSelectBox({
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
}: SearchableSelectBoxProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleInputFocus = () => {
    setIsOpen(true);
    if (selected) {
      setSearchTerm(selected);
      setSelected("");
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      if (!selected) {
        setSearchTerm("");
      }
      setIsOpen(false);
      setFocusedIndex(-1);
    }, 200);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      const selectedOption = filteredOptions[focusedIndex];
      setSelected(selectedOption);
      setSearchTerm("");
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("items-center", className)} ref={wrapperRef}>
      {label && <label className="mb-2 block font-semibold text-black">{label}</label>}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          placeholder={placeholder}
          value={selected || searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={() => setIsOpen(true)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className={cn(
            "h-10 w-full rounded-md border border-gray-300 px-4 text-gray-700",
            "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
            icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "",
            errorMsg ? "border-red-500" : "",
          )}
        />
        {icon && (
          <div
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-gray-400",
              iconPosition === "left" ? "left-3" : "right-3",
            )}
          >
            {icon}
          </div>
        )}
        {isOpen && (
          <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelected(option);
                  setSearchTerm("");
                  setIsOpen(false);
                  setFocusedIndex(-1);
                }}
                className={cn(
                  "cursor-pointer px-4 py-2",
                  selected === option
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : index === focusedIndex
                      ? "bg-gray-100 text-gray-700"
                      : "text-gray-700 hover:bg-gray-100",
                )}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mt-1 h-5 text-sm text-red-500">{errorMsg || "\u00A0"}</div>
    </div>
  );
}
