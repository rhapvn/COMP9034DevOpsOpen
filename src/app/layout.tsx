import "./globals.css";

let title = "Chemical Order";
let description = "COMP9034DevOps Team4 Design Concept of University Research Chemicals Ordering System.";

export const metadata = {
  title,
  description,
  twitter: {
    card: "card",
    title,
    description,
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="to-blue-0 h-full w-full bg-white">{children}</body>
    </html>
  );
}
