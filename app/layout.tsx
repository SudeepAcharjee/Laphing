import type { Metadata } from "next";
import { Inter, Anton, Bebas_Neue } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "The Lancing Co.",
  description: "Delicious Laphing ready in 7 minutes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${anton.variable} ${bebas.variable} min-h-screen antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-[#270606] text-white">
        {children}
      </body>
    </html>
  );
}
