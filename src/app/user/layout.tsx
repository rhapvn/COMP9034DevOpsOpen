import React from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import getUser from "@/auth/getUser";
import { NAV_ITEMS } from "../navItemsConstant";

let title = "User Profile";
let description = "Modify your user profile";

export const metadata = {
  title,
  description,
  twitter: {
    card: "card",
    title,
    description,
  },
};

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser([""]);
  console.log("Top page Login user: ", user);
  const navItems = NAV_ITEMS[user.role as keyof typeof NAV_ITEMS] || [];
  return (
    <div className="flex min-h-screen flex-col">
      <Header items={navItems} />
      {children}
      <Footer />
    </div>
  );
}
