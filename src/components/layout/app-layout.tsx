"use client";

import type React from "react";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Gauge,
  User,
  HelpCircle,
  LogOut,
  Menu,
  Moon,
  Sun,
  Globe,
  RocketIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Gauge },
    { name: "Account", href: "/account", icon: User },
    { name: "Help", href: "/help", icon: HelpCircle },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile menu */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden fixed top-4 left-4 z-40"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="p-4">
              <RocketIcon />
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setOpen(false);
                  // Sign out logic
                }}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:w-16 md:fixed md:inset-y-0 border-r">
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
          <div className="flex-1 flex flex-col pt-5 pb-4">
            <div className="flex items-center justify-center h-16">
              <RocketIcon />
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1 flex flex-col items-center">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`p-3 rounded-md hover:bg-accent ${
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground"
                  }`}
                  title={item.name}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="sr-only">{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex flex-col p-2 items-center mb-4 space-y-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              title="Sign out"
              onClick={() => {
                signOut();
              }}
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Sign out</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-16">
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 border-b bg-background">
          <h1 className="text-xl font-semibold md:text-2xl">
            {navigation.find((item) => pathname.startsWith(item.href))?.name ||
              "Dashboard"}
          </h1>
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session?.user?.image || undefined}
                      alt={session?.user?.name || "User"}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? (
                    <Sun className="mr-2 h-4 w-4" />
                  ) : (
                    <Moon className="mr-2 h-4 w-4" />
                  )}
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Globe className="mr-2 h-4 w-4" />
                  Language
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
