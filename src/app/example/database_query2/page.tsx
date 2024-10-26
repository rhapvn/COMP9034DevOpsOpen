"use client";
import { getUserById } from "@/db/apiRoutes";
import { useState } from "react";

const DatabaseQueryPage = () => {
  const [user, setUser] = useState<any>(null);

  const handleGetUser = async () => {
    setUser(await getUserById(Math.floor(Math.random() * 30)));
  };

  return (
    <div>
      <div>DatabaseQueryPage</div>

      <form action={handleGetUser}>
        <button className="h-8 w-24 rounded-md bg-blue-200" type="submit">
          Click here
        </button>
      </form>

      <div className="h-8 w-36 bg-slate-300">{user?.data?.firstName}</div>
    </div>
  );
};
export default DatabaseQueryPage;
