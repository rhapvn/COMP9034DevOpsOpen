import React from 'react';

let title = "COMP9034DevOps Team4";
let description = "Chemicals Ordering System Login page";

export const metadata = {
  title,
  description,
  twitter: {
    card: "card",
    title,
    description,
  },
};

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-[url('/flinders-background-img.jpg')]"   >
      {children}
    </div>
  );
};

export default LoginLayout;
