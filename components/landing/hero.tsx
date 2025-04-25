"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export default function Hero() {
  const router = useRouter()

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 overflow-hidden bg-black">
      {/* Gradient achtergrond */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-300 via-blue-700 to-green-500" />

      {/* Afbeelding aan rechterzijde met fade en blend-effect */}
      <div className="absolute top-0 right-0 h-full w-[40%] z-10">
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
              background: "linear-gradient(to left, rgba(29, 78, 216, 0) 60%, rgba(29, 78, 216, 0.8) 100%)"
            }}
          />
          {/* Verticale overlay voor vloeiende overgang tussen afbeelding en achtergrond */}
          <div
            className="absolute inset-0 mix-blend-soft-light"
            style={{
              background: "linear-gradient(to bottom, #B2E0FF 0%, rgba(125, 211, 252, 0.8) 30%, rgba(34, 197, 94, 0.8) 100%)"
            }}
          />
        </div>
      </div>

      {/* Content aan linkerzijde met meer ruimte */}
      <div className="relative z-20 container px-4 md:px-6 mx-auto h-full md:pl-20 ">
        <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 items-center h-full">
          <div className="space-y-6 max-w-xl text-white">
            <div className="inline-block rounded-lg bg-white bg-opacity-20 px-3 py-1 text-sm backdrop-blur-sm">
              Drone Management Simplified
            </div>
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Take Control of Your Drone Fleet
            </h1>
            <p className="text-lg text-white/90">
              Monitor, manage, and optimize your drone operations with our comprehensive platform. Real-time tracking, maintenance alerts, and flight analytics all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="gap-2 bg-white border-white text-blue-700 hover:bg-white/10"
                onClick={() => router.push("/dashboard")}
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
