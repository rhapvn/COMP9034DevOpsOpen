"use client";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center flex-col space-y-4">
        <FaExclamationTriangle size={50} className="text-red-500" />
        <div className="text-3xl font-bold text-red-500">Page Not Found</div>
        <div className="text-xl">We could not find the page you were looking for.</div>
    </div>
  );
}