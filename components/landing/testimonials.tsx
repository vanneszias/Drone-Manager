"use client";

import { Card, CardTitle, CardHeader, CardContent, CardDescription } from "../ui/card";

export default function Testimonials() {
    return (
        <section id="testimonials" className="relative w-full py-12 md:py-24 lg:py-32 bg-black">
            {/* Gradient achtergrond - omgekeerde volgorde */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-500 via-blue-700 to-sky-300" />

            <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-7xl">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-white/20 px-3 py-1 text-sm text-white">
                            Testimonials
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl text-white">
                            Trusted by Drone Professionals
                        </h2>
                        <p className="max-w-[600px] mx-auto text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Here's what our customers say about our drone management platform.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
                    <Card className="bg-black/50 border border-white/20 text-white">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-green-500/20 p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                                        <circle cx="12" cy="8" r="5"></circle>
                                        <path d="M20 21a8 8 0 1 0-16 0"></path>
                                    </svg>
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-white">Sarah Miller</CardTitle>
                                    <CardDescription className="text-white/70">Aerial Photography</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/80">
                                "This platform has revolutionized how we manage our photography drones. The battery management features alone have saved us countless hours of downtime."
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-black/50 border border-white/20 text-white">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-blue-700/20 p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                                        <circle cx="12" cy="8" r="5"></circle>
                                        <path d="M20 21a8 8 0 1 0-16 0"></path>
                                    </svg>
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-white">James Thompson</CardTitle>
                                    <CardDescription className="text-white/70">Agricultural Services</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/80">
                                "Managing a fleet of agricultural drones used to be a nightmare. Now with real-time tracking and maintenance alerts, we've improved efficiency by over 40%."
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-black/50 border border-white/20 text-white">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <div className="rounded-full bg-sky-300/20 p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-300">
                                        <circle cx="12" cy="8" r="5"></circle>
                                        <path d="M20 21a8 8 0 1 0-16 0"></path>
                                    </svg>
                                </div>
                                <div>
                                    <CardTitle className="text-lg text-white">Elena Rodriguez</CardTitle>
                                    <CardDescription className="text-white/70">Urban Inspection</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white/80">
                                "The flight planning tools have been a game-changer for our urban inspection team. We can now plan complex routes around buildings with confidence."
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}