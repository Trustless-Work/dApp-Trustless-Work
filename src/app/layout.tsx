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
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trustless Work",
  description: "Trustless Work",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#006BE4",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Trustless Work",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#006BE4" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Trustless Work" />
        <meta name="format-detection" content="telephone=no" />
      </head>
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
