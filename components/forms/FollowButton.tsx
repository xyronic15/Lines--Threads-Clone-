"use client";

import { addFollower, removeFollower } from "@/lib/actions/follow.actions";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { RiUserFollowFill } from "react-icons/ri";
import { Button } from "@/components/ui/button";

interface Props {
  accountId: string;
  currentUserId: string;
  isFollowed: boolean;
}

const FollowButton = ({ accountId, currentUserId, isFollowed }: Props) => {
  // get the pathname
  const pathname = usePathname();

  // set follow state vars
  const [followed, setFollowed] = useState<boolean>(isFollowed);

  return (
    <Button
      className={`${followed && "bg-white hover:text-white"}`}
      onClick={async () => {
        if (followed) {
          await removeFollower({
            followerId: currentUserId,
            followingId: accountId,
            path: pathname,
          });
          setFollowed(false);
        } else {
          await addFollower({
            followerId: currentUserId,
            followingId: accountId,
            path: pathname,
          });
          setFollowed(true);
        }
      }}
    >
      {followed ? (
        <RiUserFollowFill size={24} className="text-slate-900" />
      ) : (
        <p className="text-white">Follow</p>
      )}
    </Button>
  );
};

export default FollowButton;
