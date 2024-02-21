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
    <div className="flex gap-2 align-middle w-full">
      <CiSearch size={24} />
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};

export default SearchBar;
