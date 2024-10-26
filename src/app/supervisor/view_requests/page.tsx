import { getSignedUser } from "@/lib/userUtils";
import { redirect } from "next/navigation";
import SharedRequestComponents from "./RequestComponents";

const RequestPage = async () => {
  const user = await getSignedUser();
  if (!user) redirect("/login");

  return <SharedRequestComponents user={user} />;
};

export default RequestPage;
