"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"

export default function Hero() {
    const router = useRouter()
    return (    
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6 mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Drone Management Simplified
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Take Control of Your Drone Fleet
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Monitor, manage, and optimize your drone operations with our comprehensive platform. Real-time tracking, maintenance alerts, and flight analytics all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2"
                onClick={() => {
                  router.push("/home")
                }}
                >
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Request Demo
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 blur-xl" />
              <div className="relative bg-muted rounded-lg overflow-hidden border shadow-lg">
                <div className="aspect-video bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                  {/* This would be your drone dashboard preview image */}
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    Dashboard Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
}