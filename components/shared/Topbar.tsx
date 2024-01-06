"use client";

import Image from "next/image";
import Link from "next/link";
import { GoGear } from "react-icons/go";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";

const Topbar = () => {
  const router = useRouter(); // used for sign out feature

  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/assets/logo_dark.svg" alt="Lines" width={36} height={36} />
        <p className="text-xl font-bold text-white">Lines</p>
      </Link>

      <div className="text-white flex align-middle">
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-full p-1">
            <GoGear size={36} />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-950 text-white mt-5 mr-12">
            <Link href="/profile/edit">
              <DropdownMenuItem className="text-lg">
                Edit profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignedIn>
                <SignOutButton signOutCallback={() => router.push("/sign-in")}>
                  <div className="flex justify-start align-middle gap-1 text-lg">
                    <MdLogout size={24} />
                    Logout
                  </div>
                </SignOutButton>
              </SignedIn>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Topbar;
