import SignOutButton from "@/components/SignOutButton";
import getUser from "@/auth/getUser";

let title = "Example";
let description = "Next js page Example";

export const metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function ExampleLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser([""]);
  return (
    <div className="w-full border-2 border-blue-500 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-100 via-blue-50 bg-fixed">
      <header className="flex w-full justify-center p-3">
        <div className="flex w-full max-w-7xl justify-end">
          <div className="mr-3 text-xl">
            {user?.name}({user?.role})
          </div>
          <SignOutButton user={user} />
        </div>
      </header>
      <div className="flex justify-center">{children}</div>
    </div>
  );
}
