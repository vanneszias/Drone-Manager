import { ArrowRight } from "lucide-react";

import { Button } from "../ui/button";

export default function CTA() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6 mx-auto max-w-7xl">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to Transform Your Drone Operations?</h2>
                        <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Join thousands of drone operators who have streamlined their operations with our platform.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="gap-2">
                            Start Free Trial <ArrowRight className="h-4 w-4" />
                        </Button>
                        <Button size="lg" variant="outline">
                            Schedule a Demo
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}