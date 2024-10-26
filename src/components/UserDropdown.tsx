"use client";

import { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { getUserById } from "@/db/apiRoutes";
import { getSignedUser } from "@/lib/userUtils";

const UserDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [img, setImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = await getSignedUser();
      console.log(user);
      if (user?.image) setImg(user.image);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center hover:cursor-pointer" ref={dropdownRef} onClick={() => setIsDropdownOpen(!isDropdownOpen)} >
      {img ? (
        <img src={img} alt="User Avatar" className="h-[40px] w-[40px] rounded-full" />
      ) : (
        <Image src="/avatar.png" alt="User Avatar" width={40} height={40} className="rounded-full" />
      )}
      <IoChevronDown />

      {isDropdownOpen && (
        <div className="absolute right-0 top-12 z-10 w-48 rounded-md border-b-8 border-l-2 border-r-2 border-t-8 border-blue-600 bg-white shadow-lg">
          <Link
            href="/user/update_profile"
            className="block bg-blue-100 px-4 py-2 text-sm text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            Personal Details
          </Link>
          <button
            onClick={() => signOut()}
            className="w-full bg-gray-100 px-4 py-2 text-left text-sm text-blue-600 hover:bg-gray-200 hover:text-white"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
