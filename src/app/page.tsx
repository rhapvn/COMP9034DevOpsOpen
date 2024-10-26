import SignOutButton from "@/components/SignOutButton";
import { auth } from "@/auth/auth";
import { LoginUser } from "src/types";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user as LoginUser;
  const redirectPath = {
    admin: "/admin",
    approver: "/approver",
    supervisor: "/supervisor",
    researcher: "/researcher",
    storage: "/storage",
  };
  redirect(redirectPath[user.role as keyof typeof redirectPath]);

  return (
    <div className="flex justify-center">
      <div className="flex max-w-7xl flex-col items-center justify-center">
        <header className="w-full p-3">
          <div className="flex max-w-7xl justify-end">
            <div className="mr-3 text-xl">
              {user?.name}({user?.role})
            </div>
            <SignOutButton user={user} />
          </div>
        </header>
        <div>Root page</div>
      </div>
    </div>
  );
};

export default Page;
