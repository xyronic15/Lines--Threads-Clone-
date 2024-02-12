"use client";

import { joinCircle, leaveCircle } from "@/lib/actions/circle.actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdJoinInner } from "react-icons/md";
import { usePathname } from "next/navigation";

interface Props {
  circleId: string;
  currentUserId: string;
  isMember: boolean;
}

const JoinCircleButton = ({ circleId, currentUserId, isMember }: Props) => {
  // get the pathname
  const pathname = usePathname();

  // set the state vars
  const [member, setMember] = useState<boolean>(isMember);

  return (
    <Button
      className={`${member && "bg-white hover:text-white"}`}
      onClick={async () => {
        if (member) {
          await leaveCircle(currentUserId, circleId, pathname);
          setMember(false);
        } else {
          await joinCircle(currentUserId, circleId, pathname);
          setMember(true);
        }
      }}
    >
      {member ? (
        <MdJoinInner size={24} className="text-slate-900" />
      ) : (
        <p className="text-white">Join</p>
      )}
    </Button>
  );
};

export default JoinCircleButton;
