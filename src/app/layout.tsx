import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { GlobalProvider } from "@/providers/GlobalProvider";
import { Toaster } from "sonner";
import { Space_Grotesk } from "next/font/google";
import { SidebarProvider } from "@/ui/sidebar";

const Exo2 = localFont({
  src: "./fonts/Exo2.ttf",
  variable: "---exo-2",
  weight: "100 900",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.trustlesswork.com",
  ),
  title: {
    default: "Trustless Work - Escrow-as-a-Service Platform",
    template: "%s | Trustless Work",
  },
  description:
    "Trustless Work is an escrow-as-a-service platform designed to secure transactions with transparency, efficiency, and scalability. Integrate blockchain-powered escrows for your platform.",
  keywords: [
    "escrow",
    "blockchain escrow",
    "Stellar escrow",
    "trustless payments",
    "smart contracts",
    "decentralized escrow",
    "payment security",
    "transaction escrow",
    "milestone payments",
    "multi-party escrow",
    "API escrow",
    "cryptocurrency escrow",
  ],
  authors: [{ name: "Trustless Work" }],
  creator: "Trustless Work",
  publisher: "Trustless Work",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["es_ES"],
    url: "/",
    siteName: "Trustless Work",
    title: "Trustless Work - Escrow-as-a-Service Platform",
    description:
      "Secure transactions with transparency, efficiency, and scalability. Integrate blockchain-powered escrows for your platform.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Trustless Work Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trustless Work - Escrow-as-a-Service Platform",
    description:
      "Secure transactions with transparency, efficiency, and scalability. Integrate blockchain-powered escrows for your platform.",
    images: ["/logo.png"],
    creator: "@trustlesswork",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      es: "/es",
    },
  },
  category: "Finance",
  classification: "Business",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
  themeColor: "#006BE4",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Trustless Work",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.trustlesswork.com";

  // Structured Data (JSON-LD)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Trustless Work",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description:
      "Escrow-as-a-service platform designed to secure transactions with transparency, efficiency, and scalability.",
    sameAs: [
      "https://docs.trustlesswork.com/trustless-work",
      "https://www.trustlesswork.com",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Trustless Work",
    url: siteUrl,
    description:
      "Secure transactions with transparency, efficiency, and scalability. Integrate blockchain-powered escrows for your platform.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Trustless Work",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    description:
      "Escrow-as-a-service platform for secure blockchain transactions",
  };

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
        <link rel="canonical" href={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareApplicationSchema),
          }}
        />
      </head>
      <body
        className={cn(Exo2.variable, "antialiased", spaceGrotesk.className)}
      >
        <Analytics />
        <GlobalProvider>
          <Toaster position="top-right" richColors />
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
