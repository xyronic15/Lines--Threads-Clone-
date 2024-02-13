import { GoHome } from 'react-icons/go'
import { HiMagnifyingGlass } from "react-icons/hi2";
import { FaRegHeart } from "react-icons/fa";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { PiCirclesThreeBold, PiSignature } from "react-icons/pi";
import { FaRegUserCircle } from "react-icons/fa";


// navlinks for the left sidebar and bottom bar
export const navLinks = [
    {
        label: "Home",
        path: "/",
        icon: <GoHome size={24} />,
    },
    {
        label: "Search",
        path: "/search",
        icon: <HiMagnifyingGlass size={24} />,
    },
    {
        label: "Activity",
        path: "/activity",
        icon: <FaRegHeart size={24} />,
    },
    {
        label: "Create Line",
        path: "/create-line",
        icon: <BiSolidMessageSquareAdd size={24} />,
    },
    {
        label: "Circles",
        path: "/circles",
        icon: <PiCirclesThreeBold size={24} />,
    },
    {
        label: "Profile",
        path: "/profile",
        icon: <FaRegUserCircle size={24} />,
    }
]

// tabs for the profile page
export const profileTabs = [
    {
        value: "lines",
        label: "Lines",
        icon: <PiSignature size={24} />,
    },
    {
        value: "replies",
        label: "Replies",
        icon: <BiSolidMessageSquareAdd size={24} />,
    }
]

// tabs for the circle page
export const circleTabs = [
    {
        value: "lines",
        label: "Lines",
        icon: <PiSignature size={24} />,
    },
    {
        value: "members",
        label: "Members",
        icon: <FaRegUserCircle size={24} />,
    }
]