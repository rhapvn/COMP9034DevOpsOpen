"use client";
import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <div className="font-bold text-blue-600 text-xl">The page is loading...</div>
        <FaSpinner size={50} className="animate-spin text-blue-600" />
      </div>

      <div className="font-bold text-blue-600 text-xl">Please wait a moment.</div>
    </div>
  );
}