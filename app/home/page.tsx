"use client";

import LandingPage from "@/components/landing/landingpage";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <LandingPage />
      <Footer />
    </main>
  );
}
