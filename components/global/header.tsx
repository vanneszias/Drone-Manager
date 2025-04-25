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
    <header className="sticky top-0 z-40 w-full glass-effect border-b border-white/10">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link
            href="/"
            className="flex items-center space-x-3 transition-all duration-300 hover:scale-105"
          >
            <span className="theme-gradient-1 p-2 rounded-lg shadow-soft">
              <Rocket className="h-5 w-5 text-white" />
            </span>
            <span className="text-xl font-bold bg-clip-text text-transparent theme-gradient-2">
              DroneMaster
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="#features" className="nav-link">
            Features
          </Link>
          <Link href="#testimonials" className="nav-link">
            Testimonials
          </Link>
          <Link href="#faq" className="nav-link">
            FAQ
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton>
              <Button className="button-secondary">Log In</Button>
            </SignInButton>
            <SignUpButton>
              <Button className="button-primary">Sign Up</Button>
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
