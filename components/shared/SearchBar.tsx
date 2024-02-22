"use client";

import { CiSearch } from "react-icons/ci";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SearchBar = ({ route }: { route: string }) => {
  // get the router
  const router = useRouter();

  // set state vars for the search bar
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleSearch = setTimeout(() => {
      if (search) {
        router.push(`/${route}?q=${search}`);
      } else {
        router.push(`/${route}`);
      }
    }, 300);

    return () => clearTimeout(handleSearch);
  }, [search, route]);
  return (
    <div className="flex gap-2 align-middle w-full items-center justify-center">
      <CiSearch size={24} className="text-white" />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="text-white outline-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none bg-transparent border-b-2 focus:border-b-4 border-x-0 border-t-0 focus:border-slate-600 border-b-slate-800 transition-all duration-200"
      />
    </div>
  );
};

export default SearchBar;
