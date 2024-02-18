"use client";

import { usePathname } from "next/navigation";
import {
  leaveCircle,
  makeAdmin,
  removeAdmin,
} from "@/lib/actions/circle.actions";
import { Button } from "../ui/button";

export const KickMemberButton = ({
  userId,
  circleId,
}: {
  userId: string;
  circleId: string;
}) => {
  const pathname = usePathname();
  return (
    <Button
      onClick={async () => await leaveCircle(userId, circleId, pathname)}
      variant="destructive"
    >
      Kick
    </Button>
  );
};

export const MakeAdminButton = ({
  userId,
  circleId,
}: {
  userId: string;
  circleId: string;
}) => {
  const pathname = usePathname();
  return (
    <Button
      onClick={async () => await makeAdmin(userId, circleId, pathname)}
      variant="secondary"
    >
      Make Admin
    </Button>
  );
};

export const RemoveAdminButton = ({
  userId,
  circleId,
}: {
  userId: string;
  circleId: string;
}) => {
  const pathname = usePathname();
  return (
    <Button
      onClick={async () => await removeAdmin(userId, circleId, pathname)}
      variant="destructive"
    >
      Remove Admin
    </Button>
  );
};
