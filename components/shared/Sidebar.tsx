"use client";

import { navLinks } from "@/constants";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";

// side navbar
const SideBar = () => {
  const router = useRouter(); // used for sign out feature
  const pathname = usePathname();

  const { userId } = useAuth();

  return (
    <section className="sidebar">
      <div className="flex flex-col w-full gap-4 px-6">
        {navLinks.map((link) => {
          // check if the current link is active
          const isActive =
            (pathname.includes(link.path) && link.path.length > 1) ||
            pathname === link.path;

          // check if the current link is the profile page and change the path to include the userId
          link.path =
            link.path === "/profile" ? `${link.path}/${userId}` : link.path;

          // return the link with the corresponding label, path, and icon
          return (
            <Link
              key={link.label}
              href={link.path}
              className={`sidebar-link ${
                isActive ? "font-bold" : "font-extralight"
              }`}
            >
              {link.icon}
              <p className="text-lg">{link.label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex justify-start align-middle cursor-pointer gap-4 p-4 text-white font-extralight hover:font-bold">
              <MdLogout size={24} />
              <p className="text-lg">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};

export default SideBar;
