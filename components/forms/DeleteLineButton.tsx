"use client";
import { usePathname, useRouter } from "next/navigation";
import { deletePostById } from "@/lib/actions/post.actions";
import { Button } from "@/components/ui/button";

interface Props {
  id: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

const DeleteLineButton = ({
  id,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: Props) => {
  // set router and get pathname
  const router = useRouter();
  const pathname = usePathname();

  if (currentUserId !== authorId || pathname === "/") return null;
  return (
    <Button
      type="button"
      className="border border-red-600 text-red-600 hover:bg-black"
      onClick={async () => {
        await deletePostById(id, pathname);
        if (!parentId || !isComment) {
          router.push("/");
        }
      }}
    >
      Confirm
    </Button>
  );
};

export default DeleteLineButton;
