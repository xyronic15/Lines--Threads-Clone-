import { GoHome } from 'react-icons/go'
import { HiMagnifyingGlass } from "react-icons/hi2";
import { FaRegHeart } from "react-icons/fa";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { PiCirclesThreeBold } from "react-icons/pi";
import { FaRegUserCircle } from "react-icons/fa";

// navlinks for the left sidebar and bottom bar
export const navLinks = [
    {
        label: "Home",
        path: "/",
        icon: <GoHome />
    },
    {
        label: "Search",
        path: "/search",
        icon: <HiMagnifyingGlass />
    },
    {
        label: "Activity",
        path: "/activity",
        icon: <FaRegHeart />
    },
    {
        label: "Create Line",
        path: "/create-line",
        icon: <BiSolidMessageSquareAdd />
    },
    {
        label: "Circles",
        path: "/circles",
        icon: <PiCirclesThreeBold />
    },
    {
        label: "Profile",
        path: "/profile",
        icon: <FaRegUserCircle />
    }
]