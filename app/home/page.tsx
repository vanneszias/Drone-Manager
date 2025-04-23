"use client";

import HomePage from "../../components/home/home";
import Header from "@/components/global/header";
import Footer from "@/components/global/footer";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col">
            <Header />
            <HomePage />
            <Footer />
        </main>
    );
}