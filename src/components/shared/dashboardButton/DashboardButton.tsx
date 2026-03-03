"use client";

import React from "react";

interface DashboardButtonProps {
    text: string;
    onClick?: () => void;
    isLoading?: boolean;
    type?: "button" | "submit";
    className?: string;
    disabled?: boolean;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
    text,
    onClick,
    isLoading = false,
    type = "button",
    className = "",
    disabled = false,
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading || disabled}
            className={`bg-primaryBgColor text-white px-6 py-3 rounded-lg shadow transition 
      flex items-center justify-center gap-2 cursor-pointer
      ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-primaryBgColor"}
      ${className}`}
        >
            {isLoading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {isLoading ? "Processing..." : text}
        </button>
    );
};

export default DashboardButton;