import SharedRequestComponents from "@/app/supervisor/view_requests/RequestComponents";
import { getSignedUser } from "@/lib/userUtils";
import { redirect } from "next/navigation";

const RequestPage = async () => {
  const user = await getSignedUser();
  if (!user) redirect("/login");

  return <SharedRequestComponents user={user} />;
};

export default RequestPage;
