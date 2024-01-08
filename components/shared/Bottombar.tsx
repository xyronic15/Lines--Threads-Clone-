"use client";

import { navLinks } from "@/constants";
import Link from "next/link";

const Bottombar = () => {
  return (
    <footer className="bottombar">
      <div className="bottombar-container">
        {navLinks.map((link) => (
          <Link key={link.label} href={link.path} className="text-white py-4">
            {link.icon}
          </Link>
        ))}
      </div>
    </footer>
  );
};

export default Bottombar;
