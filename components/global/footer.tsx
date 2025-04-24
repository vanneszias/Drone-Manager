import { Button } from "../ui/button";
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full py-6 bg-background border-t">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Rocket className="h-6 w-6" />
                            <span className="text-xl font-bold">DroneMaster</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Simplifying drone fleet management for businesses and professionals worldwide.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#features" className="text-muted-foreground hover:text-foreground">Features</Link>
                            </li>
                            <li>
                                <Link href="#testimonials" className="text-muted-foreground hover:text-foreground">Testimonials</Link>
                            </li>
                            <li>
                                <Link href="#faq" className="text-muted-foreground hover:text-foreground">FAQ</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">Blog</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">Documentation</Link>
                            </li>
                            <li>
                                <Link href="#" className="text-muted-foreground hover:text-foreground">Support Center</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="text-muted-foreground">hello@dronemaster.com</li>
                            <li className="text-muted-foreground">+1 (555) 123-4567</li>
                            <li className="text-muted-foreground">123 Drone Street, Tech City</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 border-t pt-6 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-xs text-muted-foreground">© 2025 DroneMaster. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                            <span className="sr-only">Facebook</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                            </svg>
                            <span className="sr-only">Twitter</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                            </svg>
                            <span className="sr-only">Instagram</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                <rect width="4" height="12" x="2" y="9"></rect>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                            <span className="sr-only">LinkedIn</span>
                        </Button>
                    </div>
                </div>
            </div>
        </footer>
    )
}