"use client";

import { formatText } from "@/lib/helper";
import Image from "next/image";

interface Props {
  // User and circle values
  accountId: string;
  currentUserId: string;
  name: string;
  username: string;
  image: string;
  bio: string;
  postCounts?: number; // only use if user
  followers?: number; // only use if user
  following?: number; // only use if user
  isFollowingMember?: boolean; // check if current user if following or if they are a member
  // Circle values
  isCircle?: boolean; // check if this is community or not
  ownerId?: string; // id of the creator or owner of circle
  admins?: string[]; // ids of all the admins
  members?: number; // count of all members in circle
}

const ProfileHeader = ({
  accountId,
  currentUserId,
  name,
  username,
  image,
  bio,
  postCounts,
  followers,
  following,
  isFollowingMember,
  isCircle,
  ownerId,
  admins,
}: Props) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex item-center gap-3">
        {/* profile picture */}
        <div className="relative h-20 w-20 object-cover align-middle">
          <Image
            src={image}
            alt="profile picture"
            fill
            className="rounded-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-1">
          {/* name */}
          <h2 className="text-white">{name}</h2>
          {/* username */}
          <p className="text-gray-500">@{username}</p>

          {/* TBC post count, followers, following if not a circle*/}
          {/* TBC else members count*/}
          {!isCircle ? (
            <div className="flex flex-row gap-2">
              <div className="text-white flex flex-col justify-start">
                <p className="text-sm font-bold">Posts</p>
                <p className="text-sm">{postCounts}</p>
              </div>
              {/* <div className="text-white flex flex-col justify-start">
                <p className="text-sm font-bold">Followers</p>
                <p className="text-sm">{followers}</p>
              </div>
              <div className="text-white flex flex-col justify-start">
                <p className="text-sm font-bold">Following</p>
                <p className="text-sm">{following}</p>
              </div> */}
            </div>
          ) : (
            <></>
          )}

          {/* TBC follow button */}
          {/* TBC join circle button */}
        </div>
      </div>

      {/* bio */}
      <p
        className="mt-2 text-md text-gray-400 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{
          __html: formatText(bio, "text-sky-600 hover:underline"),
        }}
      />
    </div>
  );
};

export default ProfileHeader;
