import { getSignedUser } from "@/lib/userUtils";
import { redirect } from "next/navigation";
import ResearcherRequestComponents from "./RequestCompoents";

const RequestPage = async () => {
  const user = await getSignedUser();
  if (!user) redirect("/login");

  return <ResearcherRequestComponents user={user} />;
};

export default RequestPage;
