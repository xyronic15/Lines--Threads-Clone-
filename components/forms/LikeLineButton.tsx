"use client";

import { toggleLike } from "@/lib/actions/post.actions";
import { set } from "mongoose";
import { useEffect, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
// import { getLikes } from "@/lib/actions/post.actions";

interface Props {
  id: string;
  likes: string[];
  currentUserId: string;
}
const LikeLineButton = ({ id, likes, currentUserId }: Props) => {
  // set buttonLikes and isLiked state vars
  const [buttonLikes, setLikes] = useState<string[]>(likes);
  const [isLiked, setIsLiked] = useState<boolean>(
    likes.includes(currentUserId)
  );

  return (
    <div className="flex flex-row gap-2 align-middle">
      {isLiked ? (
        <FaHeart
          size={24}
          className="text-pink-600 hover:scale-125 duration-300"
          onClick={async () => {
            await toggleLike(id, currentUserId, !isLiked);
            setIsLiked(!isLiked);
            setLikes(buttonLikes.filter((like) => like !== currentUserId));
          }}
        />
      ) : (
        <FaRegHeart
          size={24}
          className="text-white hover:scale-125 duration-300"
          onClick={async () => {
            await toggleLike(id, currentUserId, !isLiked);
            setIsLiked(!isLiked);
            setLikes([...buttonLikes, currentUserId]);
          }}
        />
      )}
      {/* <FaHeart
        size={24}
        className="text-pink-600 hover:scale-125 duration-300"
      /> */}

      <p className="text-white">{buttonLikes.length}</p>
    </div>
  );
};

export default LikeLineButton;
