'use client';
import React from 'react';
import Link from "next/link";
import { CircleUser, Menu,Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { usePathname } from 'next/navigation';

type Props = {}

function Header (props: Props)  {
  const path =usePathname();
  const active = path.split("/")[1];
  
  return (
    <div className="flex  w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b border-b-gray-500 bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <Github className="h-6 w-6" />
            <span className="sr-only">Bounty</span>
          </Link>
          <Link href="/repos" className={` transition-colors hover:text-foreground ${active === "repos" ? "text-foreground" : "text-muted-foreground"}`}>
            Repos
          </Link>
          <Link href="/bounty" className={` transition-colors hover:text-foreground ${active === "bounty" ? "text-foreground" : "text-muted-foreground"}`}>
            Bounty
          </Link>
          
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <Github className="h-6 w-6" />
              <span className="sr-only">Bounty</span>
              </Link>
              <Link href="/repos" className="hover:text-foreground">
                Repos
              </Link>
              <Link href="/bounty" className="text-muted-foreground hover:text-foreground">
                Bounty
              </Link>
              
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full justify-end items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </div>
  );
};

export default Header;
