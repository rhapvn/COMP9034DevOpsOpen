/*
 * InputField
 *
 * icon: icon={<AiFillExperiment />} use react icon or ReactNode
 * className: Applied to the root div element
 */
import { cn } from "@/lib/utils";
import React from "react";

// Extend InputFieldProps to include all HTMLInputElement attributes
type TextAreaFieldProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  icon?: React.ReactNode;

  iconPosition?: "left" | "right";
  errorMsg?: string;
  rows?: number;
};

const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ label, className, icon, iconPosition = "left", errorMsg, rows = 3, ...props }, ref) => {
    return (
      <div className={cn("items-center", className)}>
        {label && <label className="mb-2 block font-semibold text-black">{label}</label>}
        <div className="relative">
          <textarea
            ref={ref}
            rows={rows}
            {...props}
            className={cn(
              "w-full rounded-md border border-gray-300 px-4 py-2 text-gray-700",
              "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200",
              " disabled:resize-none disabled:cursor-not-allowed disabled:pointer-events-none disabled:focus:outline-none disabled:hover:bg-transparent",
              className,
              icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "",
              errorMsg ? "border-red-500" : "",
            )}
          />
          {icon && (
            <div className={cn("absolute top-3 text-gray-400", iconPosition === "left" ? "left-3" : "right-3")}>
              {icon}
            </div>
          )}
        </div>
        <div className="mt-1 h-5 text-sm text-red-500">{errorMsg || "\u00A0"}</div>
      </div>
    );
  },
);

TextAreaField.displayName = "TextAreaField";

export default TextAreaField;
