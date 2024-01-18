// "use client"
import Image from "next/image";
import Link from "next/link";
import MediaCarousel from "@/components/shared/MediaCarousel";
import { FaRegHeart, FaRegComment } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDateString } from "@/lib/utils";
import { formatText } from "@/lib/helper";
import DeleteLineButton from "@/components/forms/DeleteLineButton";
import LikeLineButton from "@/components/forms/LikeLineButton";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  text: string;
  media: string[];
  author: {
    id: string;
    name: string;
    image: string;
  };
  circle: {
    _id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  adjustedLikes: string[];
  editedAt: string | null;
  active: boolean;
  comments: {
    author: {
      name: string;
      image: string;
    };
  }[];
  isComment?: boolean;
}

const LineCard = ({
  id,
  currentUserId,
  parentId,
  text,
  media,
  author,
  circle,
  createdAt,
  adjustedLikes,
  editedAt,
  active,
  comments,
  isComment,
}: Props) => {
  return (
    <article
      className={`flex w-full flex-col rounded-xl gap-2 ${
        isComment ? "px-0 xs:px-7" : "bg-slate-800 p-7"
      }`}
    >
      {/* main portion of the card */}
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          {/* author information */}
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="author"
                fill
                style={{ objectFit: "cover" }}
                className="cursor-pointer rounded-full"
              />
            </Link>

            {/* TBC separator */}
          </div>
          <div className="flex w-full flex-col">
            <Link
              href={`/profile/${author.id}`}
              className="text-white cursor-pointer font-semibold"
            >
              {/* TBC to header */}
              {author.name}
            </Link>

            {/* content of the post */}
            {/* linkify the text */}
            {active ? (
              <p
                className="mt-2 text-white whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: formatText(text, "underline hover:font-medium"),
                }}
              />
            ) : (
              <p className="text-gray-500 italic">{text}</p>
            )}
            {/* <p className="mt-2 text-white whitespace-pre-wrap">{text}</p> */}
          </div>

          {/* TBC delete and edit line component */}
          <div className="flex items-start">
            {currentUserId === author.id && !isComment && active && (
              <Dialog>
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-white outline-none">
                    <BsThreeDots size={24} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-950 text-white mr-20 translate-y-[-36px] border-0">
                    <Link
                      href={{
                        pathname: "/edit-line",
                        query: {
                          id: id,
                        },
                      }}
                    >
                      <DropdownMenuItem>Edit line</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem className="text-red-600">
                      <DialogTrigger className="w-full flex items-start">
                        Delete line
                      </DialogTrigger>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DialogContent className="bg-slate-950 text-white">
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. Are you sure you want to
                      permanently delete this post?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DeleteLineButton
                      id={id}
                      currentUserId={currentUserId}
                      authorId={author.id}
                      parentId={parentId}
                      isComment={isComment}
                    />
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* tbc make preview images if it is a comment */}
      {media.length > 0 && (
        <div className="col-span-2 my-2">
          <MediaCarousel media={media} />
        </div>
      )}

      {/* icons for actions: like and comment */}
      <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
        {active && (
          <div className="flex flex-row justify-between align-middle">
            {/* Like button */}
            <LikeLineButton
              id={id}
              likes={adjustedLikes}
              currentUserId={currentUserId}
            />

            {/* Edited and posted date */}
            <p className="text-gray-400 text-sm">
              {editedAt
                ? `Edited on: ${formatDateString(editedAt)}`
                : `Created on: ${formatDateString(createdAt)}`}
            </p>
          </div>
        )}
        {/* if this card is a comment, show how many comments it has */}
        {isComment && comments.length > 0 && (
          <Link href={`/thread/${id}`}>
            <p className="mt-1 font-medium text-white">
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        )}
      </div>

      {/* if this is not a comment and it has comments */}
      {!isComment && comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-2">
          {comments.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user_${index}`}
              width={24}
              height={24}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}

          <Link href={`/thread/${id}`}>
            <p className="mt-1 font-medium text-white">
              {comments.length} repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {!isComment && circle && (
        <Link
          href={`/circles/${circle._id}`}
          className="mt-5 flex items-center"
        >
          <p className="font-medium text-white">
            {createdAt}
            {circle && ` - ${circle.name} circle`}
          </p>

          <Image
            src={circle.image}
            alt={circle.name}
            width={14}
            height={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
};

export default LineCard;
