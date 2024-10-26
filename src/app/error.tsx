"use client";
import { FaExclamationCircle } from "react-icons/fa";

export default function Error() {
  return (
    <div className="flex h-screen items-center justify-center flex-col space-y-4">
      <FaExclamationCircle size={50} className="text-red-500" />
      <div className="text-3xl font-bold text-red-500">Something Went Wrong</div>
      <div className="text-xl">An unexpected error has occurred. Please try again later.</div>
    </div>
  );
}
