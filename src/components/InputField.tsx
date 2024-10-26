/*
 * InputField
 *
 * icon: icon={<AiFillExperiment />} use react icon or ReactNode
 * className: Applied to the root div element
 */
import { cn } from "@/lib/utils";
import React from "react";

// Extend InputFieldProps to include all HTMLInputElement attributes
type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  errorMsg?: string;
  rows?: number;
  labelClassName?: string;
};

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, className, icon, iconPosition = "left", errorMsg, rows, labelClassName, ...props }, ref) => {

    return (
      <div className={cn("items-center")}>
        {label && <label className={cn("mb-2 block font-semibold text-black", labelClassName)}>{label}</label>}
        <div className="relative">
          <input
            ref={ref}
            {...props}
            className={cn(
              "w-full rounded-md border border-gray-300 px-4 text-gray-700",
              "focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200",
              rows ? `h-${rows * 10}` : "h-10",
              className,
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
        </div>
        <div className="mt-1 h-5 text-sm text-red-500">{errorMsg || "\u00A0"}</div>
      </div>
    );
  },
);

InputField.displayName = "InputField";

export default InputField;
