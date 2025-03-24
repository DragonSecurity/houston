"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-7">
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-white"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 1 0 9 10 10 0 0 0 0-18z" />
              </svg>
            </div>
            <span className="ml-2 text-xl font-bold">GRAVITY</span>
          </Link>
        </div>
        <nav className="flex flex-col space-y-3 px-7 pt-10">
          <Link
            href="#features"
            className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="#faqs"
            className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            FAQs
          </Link>
          <Link
            href="#contact"
            className="text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
          <div className="pt-4">
            <Link href="/signin" onClick={() => setOpen(false)}>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600">
                SIGN IN
              </Button>
            </Link>
          </div>
          <div className="pt-2">
            <Link href="/signup" onClick={() => setOpen(false)}>
              <Button variant="outline" className="w-full">
                SIGN UP
              </Button>
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
