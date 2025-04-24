import { Rocket } from "lucide-react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center space-x-2">
            <Rocket className="h-6 w-6" />
            <span className="text-xl font-bold">DroneMaster</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="#features"
            className="transition-colors hover:text-foreground/80"
          >
            Features
          </Link>
          <Link
            href="#testimonials"
            className="transition-colors hover:text-foreground/80"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="transition-colors hover:text-foreground/80"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="transition-colors hover:text-foreground/80"
          >
            FAQ
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton>
              <Button variant="outline">Log In</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
