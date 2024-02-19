import LineCard from "@/components/cards/LineCard";
import CommentLine from "@/components/forms/CommentLine";
import { fetchPostById } from "@/lib/actions/post.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  // get the current user
  const user = await currentUser();
  if (!user) return null;

  // retrieve the user from mongodb and check if onboarded
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // get the post by id from mongodb
  const line = await fetchPostById(params.id);

  return (
    <section className="relative">
      <div>
        <LineCard
          id={line._id}
          currentUserId={user.id}
          parentId={line.parentId}
          text={line.text}
          media={line.media}
          author={line.author}
          circle={line.circle}
          createdAt={line.createdAt}
          adjustedLikes={line.adjustedLikes}
          editedAt={line.editedAt}
          active={line.active}
          comments={line.children}
        />
        {/* <p className="text-white">The problem is the line</p>
        <p className="text-white">{typeof line._id}</p> */}
      </div>

      {/* Comment form */}
      <div className="mt-7">
        <CommentLine
          currentUserId={userInfo._id}
          currentUserImg={userInfo.image}
          postId={line._id}
        />
      </div>

      {/* comments */}
      <div className="flex flex-col divide-y divide-solid divide-slate-800">
        {line.children.map((comment: any) => (
          <LineCard
            key={comment._id}
            id={comment._id}
            currentUserId={user.id}
            parentId={comment.parentId}
            text={comment.text}
            media={comment.media}
            author={comment.author}
            circle={comment.circle}
            createdAt={comment.createdAt}
            adjustedLikes={comment.likes}
            editedAt={comment.editedAt}
            active={comment.active}
            comments={comment.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default page;
