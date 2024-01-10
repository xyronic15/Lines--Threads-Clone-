import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";

export const metadata = {
  title: "Lines",
  description: "A Next.js 13 Threads Clone Application",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`bg-slate-950 ${inter.className}`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
