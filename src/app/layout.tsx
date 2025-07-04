import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { GlobalProvider } from "@/providers/GlobalProvider";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";

const Exo2 = localFont({
  src: "./fonts/Exo2.ttf",
  variable: "---exo-2",
  weight: "100 900",
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trustless Work",
  description: "Trustless Work",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(Exo2.variable, "antialiased", inter.className)}>
        <Analytics />
        <GlobalProvider>
          <Toaster />
          <SidebarProvider>
            <div className="relative flex min-h-screen w-full">
              <div className="flex-1 flex flex-col w-full">
                <div className="flex-1 w-full p-4  min-h-[calc(100vh-2rem-2rem)]">
                  {children}
                </div>
              </div>
            </div>
          </SidebarProvider>
        </GlobalProvider>
      </body>
    </html>
  );
}
