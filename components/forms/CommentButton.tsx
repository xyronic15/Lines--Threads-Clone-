"use client";

import { FaRegMessage } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Props {
  id: string;
  comments: string[];
}

const CommentButton = ({ id, comments }: Props) => {
  // get the current pathname
  const pathname = usePathname();
  return (
    <div className="flex flex-row gap-2 align-middle">
      {pathname === `/line/${id}` ? (
        <FaRegMessage size={24} className="text-white" />
      ) : (
        <Link href={`/line/${id}`}>
          <FaRegMessage
            size={24}
            className="text-white hover:scale-125 duration-300"
          />
        </Link>
      )}

      <p className="text-white">{comments.length}</p>
    </div>
  );
  // console.log(comments.length);
  // return <></>;
};

export default CommentButton;
