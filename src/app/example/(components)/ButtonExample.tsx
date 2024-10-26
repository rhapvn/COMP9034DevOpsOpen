import { cn } from "@/lib/utils";
import React from "react";

type props = {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
};

const ButtonExample = ({ children, disabled = false, onClick = () => { }, className: additionalClass }: props) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "w-36 transform rounded-lg bg-blue-500 px-8 py-4 text-lg text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-blue-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 active:bg-blue-700 active:shadow-none disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none",
                additionalClass,
            )}
        >
            {children}
        </button>
    );
};

export default ButtonExample;
