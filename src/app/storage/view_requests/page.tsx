"use client";
import { getSignedUser } from "@/lib/userUtils";
import StorageRequestComponents from "./RequestComponents";
import { useEffect } from "react";
import useLocalStorage from "src/hook/useLocalStorage";
import { LoginUser } from "src/types";
import Loading from "@/app/loading";

const RequestPage = () => {
  const [user, setUser] = useLocalStorage<LoginUser | null>("user", null);
  useEffect(() => {
    const fetchData = async () => {
      const fetchedUser = await getSignedUser();
      fetchedUser && setUser(fetchedUser);
    };
    fetchData();
  }, [setUser]);

  return user ? <StorageRequestComponents user={user} /> : <Loading />;
};

export default RequestPage;
