import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import ScrollProgress from "@/components/global/scroll-progress";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "DroneMaster",
  description: "Drone Management Simplified",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} antialiased`}>
          <ScrollProgress />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
