import React from "react";
import { Input } from "@/components/ui/input";

interface GlobalFilterProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  label: string;
}

export function GlobalFilterInput({ globalFilter, setGlobalFilter, label }: GlobalFilterProps) {
  return (
    <div className="flex w-80 justify-start ">
      <div className="py-2 text-sm font-bold text-slate-700 w-24">{label}</div>
      <Input
        placeholder="Search..."
        value={globalFilter ?? ""}
        onChange={(event) => setGlobalFilter(event.target.value)}
        className="max-w-sm"
      />
    </div>
  );
}
