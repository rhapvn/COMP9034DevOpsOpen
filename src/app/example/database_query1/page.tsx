"use client";
import { useState } from "react";
import { getUserById } from "@/db/apiRoutes";

const DatabaseQueryPage = () => {
  const [user, setUser] = useState<any>(null);

  const handleGetUser = async () => {
    setUser(await getUserById(Math.floor(Math.random() * 30)));
  };

  return (
    <div>
      <div>DatabaseQueryPage</div>
      <div
        className="h-8 w-24 rounded-md bg-blue-200"
        onClick={handleGetUser}
      >
        Click here
      </div>
      <div className="h-8 w-36 bg-slate-300">{user?.data?.firstName}</div>
    </div>
  );
};
export default DatabaseQueryPage;
