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

export const metadata: Metadata = {
  title: "de Laphing co.",
  description: "Delicious Laphing ready in 5 minutes",
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
