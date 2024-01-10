import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../globals.css";
import SideBar from "@/components/shared/Sidebar";
import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lines",
  description: "A Next.js 13 Threads Clone Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: "dark",
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <Topbar />
          <main className="flex flex-row">
            <SideBar />

            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>

            <Bottombar />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
