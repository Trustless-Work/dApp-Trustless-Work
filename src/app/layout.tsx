import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import MoonpayClientProvider from "@/providers/MoonpayClientProvider";

const Exo2 = localFont({
  src: "./fonts/Exo2.ttf",
  variable: "---exo-2",
  weight: "100 900",
});

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
      <body className={cn(Exo2.variable, "antialiased")}>
        <MoonpayClientProvider>
          <div className="relative flex min-h-screen w-full">
            <div className="flex-1 flex flex-col w-full">
              <div className="flex-1 w-full p-4  min-h-[calc(100vh-2rem-2rem)]">
                {children}
              </div>
            </div>
          </div>
        </MoonpayClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
