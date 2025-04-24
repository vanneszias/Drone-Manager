import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export default function FAQ() {
    return (
        <section id="faq" className="relative w-full py-12 md:py-24 lg:py-32 bg-black">
            {/* Zelfde gradient achtergrond als CTA */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-500 via-blue-700 to-sky-300" />

            <div className="container relative z-10 px-4 md:px-6 mx-auto max-w-7xl">
                <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
                    <div className="space-y-2">
                        <div className="inline-block rounded-lg bg-white/20 px-3 py-1 text-sm">
                            FAQ
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                            Frequently Asked Questions
                        </h2>
                        <p className="max-w-[600px] text-white/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Common questions about our drone management platform.
                        </p>
                    </div>
                </div>

                <div className="mx-auto max-w-3xl mt-12 space-y-4">
                    {[
                        {
                            title: "How does real-time tracking work?",
                            content:
                                "Our platform connects to your drones via their onboard telemetry systems, providing continuous GPS location data, altitude, speed, and battery status. This information is updated every few seconds to give you accurate real-time monitoring.",
                        },
                        {
                            title: "Is the platform compatible with all drone models?",
                            content:
                                "We support most major commercial drone manufacturers including DJI, Autel, Parrot, and Skydio. Our platform can be customized to work with specialized industrial drones as well. Contact us for specific compatibility information.",
                        },
                        {
                            title: "How secure is the data on your platform?",
                            content:
                                "Security is our top priority. All data is encrypted both in transit and at rest. We use industry-standard security protocols and regularly undergo security audits. Your drone data is protected by enterprise-grade security measures.",
                        },
                        {
                            title: "Can I integrate with other software systems?",
                            content:
                                "Yes, our platform offers robust API access that allows for integration with many business systems including asset management, ERP, and GIS software. We also provide direct integrations with popular drone mission planning tools.",
                        },
                    ].map((item, i) => (
                        <Card key={i} className="bg-white/10 border-white/20 text-white">
                            <CardHeader>
                                <CardTitle>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-white/90">{item.content}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
