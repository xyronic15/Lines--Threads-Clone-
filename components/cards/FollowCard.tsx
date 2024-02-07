import Image from "next/image";
import Link from "next/link";
import FollowButton from "../forms/FollowButton";
import { formatText } from "@/lib/helper";

interface Props {
  followerId: string;
  currentUserId: string;
  name: string;
  username: string;
  bio: string;
  image: string;
  isFollowed: boolean;
}

const FollowCard = ({
  followerId,
  currentUserId,
  name,
  username,
  bio,
  image,
  isFollowed,
}: Props) => {
  return (
    <article className="flex w-full flex-col sm:flex-row gap-4 p-7">
      {/* author information */}
      <div className="flex items-center align-middle">
        <Link href={`/profile/${followerId}`} className="relative h-11 w-11">
          <Image
            src={image}
            alt="follower"
            fill
            style={{ objectFit: "cover" }}
            className="cursor-pointer rounded-full"
          />
        </Link>
      </div>
      <div className="flex w-full flex-col">
        <Link href={`/profile/${followerId}`}>
          <p className="text-white">
            <span className="cursor-pointer font-semibold">{name} </span>
            followed you
          </p>
          <p className="text-gray-500">@{username}</p>
        </Link>
        {/* bio */}
        <p
          className="mt-2 text-md text-gray-400 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{
            __html: formatText(bio, "text-sky-600 hover:underline"),
          }}
        />
      </div>
      <div className="flex items-center align-middle">
        <FollowButton
          accountId={followerId}
          currentUserId={currentUserId}
          isFollowed={isFollowed}
        />
      </div>
    </article>
  );
};

export default FollowCard;
