"use client";
import { getUserById } from "@/db/apiRoutes";
import { useState, useEffect } from "react";

const DatabaseQueryPage = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  const generateRandomId = () => {
    setUserId(Math.floor(Math.random() * 30));
  };

  useEffect(() => {
    const handleGetUser = async () => {
      if (userId !== null) setUser(await getUserById(userId));
    };

    handleGetUser();
  }, [userId]);

  return (
    <div>
      <div>DatabaseQueryPage</div>

      <button className="h-8 w-24 rounded-md bg-blue-200" onClick={generateRandomId}>
        Generate ID
      </button>

      <div className="h-8 w-36 bg-slate-300">{user?.data?.firstName}</div>
    </div>
  );
};

export default DatabaseQueryPage;
