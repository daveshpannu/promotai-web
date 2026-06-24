import type { Metadata } from "next";
import { Albert_Sans, Alumni_Sans_Pinstripe } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const albertSans = Albert_Sans({
  variable: "--font-albert-sans",
  subsets: ["latin"],
});

const alumniPinstripe = Alumni_Sans_Pinstripe({
  weight: "400",
  variable: "--font-alumni-pinstripe",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromotAI - Advertiser Portal",
  description: "Manage your AI chatbot ad campaigns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${albertSans.variable} ${alumniPinstripe.variable} h-full antialiased bg-lacquer-black`}
    >
      <body className="min-h-full flex flex-col font-sans text-text-warm">
        <SessionProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
