"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export default function CTA() {
    return (
        <section className="relative w-full py-12 md:py-24 lg:py-32 bg-black">
            {/* Gradient achtergrond - zelfde volgorde als hero */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-blue-700 to-green-500" />
            
            <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-7xl">
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="space-y-3">
                        <div className="inline-block rounded-lg bg-white/20 px-3 py-1 text-sm text-white">
                            Transform Your Business
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl text-white">
                            Ready to Transform Your Drone Operations?
                        </h2>
                        <p className="max-w-[600px] mx-auto text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Join thousands of drone operators who have streamlined their operations with our platform.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        <Button 
                            size="lg" 
                            className="gap-2 bg-white text-blue-700 hover:bg-white/10"
                        >
                            Start Free Trial <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button 
                            size="lg" 
                            className="gap-2 bg-white text-blue-700 hover:bg-white/10"
							>
                            Schedule a Demo
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}