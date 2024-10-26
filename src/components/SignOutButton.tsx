import Image from "next/image";
import React from "react";
import { signOut } from "@/auth/auth";
import { LoginUser } from "src/types";

function SignOutButton({ user }: { user: LoginUser | undefined }) {
  if (!user) return <></>;
  const handleSignOut = async () => {
    "use server";
    await signOut();
  };

  return (
    <>
      <div className="flex  justify-center ">
        <form action={handleSignOut}>
          <button className="flex items-center  justify-center">
            {user.image ? (
              <Image
                src={user.image}
                alt="Picture of the author"
                width={30}
                height={30}
                className="mr-2 rounded-full shadow-sm shadow-black"
              />
            ) : (
              <div className="h-[30px] w-[30px] rounded-full bg-gray-200"></div>
            )}
            <span className="text-nowrap">Log out</span>
          </button>
        </form>
      </div>
    </>
  );
}

export default SignOutButton;
