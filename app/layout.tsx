import type { Metadata } from "next";
import { Inter, Anton, Bebas_Neue, Slackey } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import ReferModal from "@/components/ReferModal";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const anton = Anton({
  weight: "400",
  variable: "--font-anton",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const slackey = Slackey({
  weight: "400",
  variable: "--font-slackey",
  subsets: ["latin"],
});

import JsonLd from "@/components/JsonLd";

const siteUrl = "https://thelaphing.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Laphing Co. | Authentic Tibetan Spicy Cold & Soupy Noodles | Majnu Ka Tilla Style",
    template: "%s | The Laphing Co.",
  },
  description:
    "Order authentic Tibetan Laphing online. Experience Delhi Majnu Ka Tilla street food at home with spicy cold noodles, tangy soupy laphing, artisanal chilli oil & Wai Wai crunch ready in 5 minutes.",
  keywords: [
    "laphing",
    "spicy",
    "cold noodles",
    "soupy noodles",
    "tibetian streetfood",
    "tibetan street food",
    "laphing at home",
    "laphing recipe",
    "laphing chilli oil",
    "laphing in delhi",
    "majnu ka tilla laphing",
    "waiwai laphing",
    "wai wai laphing",
    "tibetan laphing kit",
    "delhi street food online",
    "the laphing co",
  ],
  authors: [{ name: "The Laphing Co." }],
  creator: "The Laphing Co.",
  publisher: "The Laphing Co.",
  category: "Food & Beverage",
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [],
    shortcut: [],
    apple: [],
  },
  openGraph: {
    title: "The Laphing Co. | Authentic Tibetan Spicy Cold & Soupy Noodles",
    description:
      "Craving authentic Tibetan Laphing? Enjoy Delhi Majnu Ka Tilla style spicy cold & soupy noodles at home in 5 minutes with signature roasted chilli oil and crunchy Wai Wai.",
    url: siteUrl,
    siteName: "The Laphing Co.",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The Laphing Co. - Authentic Tibetan Spicy Cold Noodles with Chilli Oil & Wai Wai Crunch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Laphing Co. | Authentic Tibetan Spicy Cold & Soupy Noodles",
    description:
      "Order authentic Tibetan Laphing online. Enjoy Majnu Ka Tilla Delhi street food at home with artisanal chilli oil, cold bouncy noodles & Wai Wai crunch.",
    images: ["/og-image.jpg"],
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
  other: {
    "geo.region": "IN-DL",
    "geo.placename": "Majnu-ka-tilla, New Delhi, India",
    "geo.position": "28.7011;77.2285",
    "ICBM": "28.7011, 77.2285",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${anton.variable} ${bebas.variable} ${slackey.variable} min-h-screen antialiased`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="min-h-screen flex flex-col bg-black text-white">
        <AuthProvider>
          {children}
          <Suspense fallback={null}>
            <AuthModal />
          </Suspense>
          <ReferModal />
        </AuthProvider>
      </body>
    </html>
  );
}
