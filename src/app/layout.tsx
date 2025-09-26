import type { Metadata } from "next";
import "./globals.css";
import PersistentNavbar from "@/components/PersistentNavbar";

export const metadata: Metadata = {
  title: "ARKHA - NASA Space Apps",
  description: "Design your refuge beyond Earth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-gradient-to-br from-[#0042A6] to-[#07173F] h-screen overflow-hidden">
        <PersistentNavbar />
        <main className="h-full">
          {children}
        </main>
      </body>
    </html>
  );
}
