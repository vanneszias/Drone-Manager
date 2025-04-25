"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden bg-black">
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0 animate-gradient-xy">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-600 to-green-500 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 via-pink-500 to-red-500 opacity-30 mix-blend-overlay" />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-float" />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-500/20 rounded-full blur-xl animate-float-delay" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-xl animate-float-slow" />
      </div>

      {/* Image on right side with fade and blend effect */}
      <div className="absolute top-0 right-0 h-full w-[45%] z-10">
        <div className="relative h-full">
          <img
            src="/images/heroPhotoDrones.png"
            alt="Hero Drones"
            className="h-full w-full object-cover mix-blend-overlay opacity-90"
          />
          {/* Zachte horizontale fade naar links */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to left, rgba(29, 78, 216, 0) 60%, rgba(29, 78, 216, 0.8) 100%)",
            }}
          />
          {/* Verticale overlay voor vloeiende overgang tussen afbeelding en achtergrond */}
          <div
            className="absolute inset-0 mix-blend-soft-light"
            style={{
              background:
                "linear-gradient(to bottom, #B2E0FF 0%, rgba(125, 211, 252, 0.8) 30%, rgba(34, 197, 94, 0.8) 100%)",
            }}
          />
        </div>
      </div>

      {/* Content on left side with more space and animations */}
      <div className="relative z-20 container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 items-center h-full">
          <div className="space-y-8 max-w-xl text-white animate-fade-in">
            <div className="inline-block rounded-xl bg-white/20 px-4 py-2 text-sm backdrop-blur-md border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300">
              Drone Management Simplified
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-sky-200 animate-gradient">
              Take Control of Your Drone Fleet
            </h1>
            <p className="text-xl text-white/90 leading-relaxed animate-fade-in-delay">
              Monitor, manage, and optimize your drone operations with our
              comprehensive platform. Real-time tracking, maintenance alerts,
              and flight analytics all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-delay-2">
              <Button
                size="lg"
                className="gap-2 bg-white/90 border-white text-blue-700 hover:bg-white hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-md"
                onClick={() => router.push("/dashboard")}
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
