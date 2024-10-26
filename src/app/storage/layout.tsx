import React from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import getUser from "@/auth/getUser";

import { NAV_ITEMS } from "../navItemsConstant";

let title = "Storage Control Dashboard";
let description = "Storage Control Dashboard";

export const metadata = {
  title,
  description,
  twitter: {
    card: "card",
    title,
    description,
  },
};

export default async function StorageLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser(["storage"]);
  console.log("Top page Login user: ", user);
  const navItems = NAV_ITEMS[user.role as keyof typeof NAV_ITEMS] || [];
  return (
    <div className="flex min-h-screen w-full flex-col items-center">
      <Header items={navItems} />
      <div className="w-full max-w-7xl mb-14">{children}</div>
      <Footer />
    </div>
  );
}
