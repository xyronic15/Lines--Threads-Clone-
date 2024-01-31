import LineCard from "@/components/cards/LineCard";
import { fetchUserPosts } from "@/lib/actions/user.actions";
import { requestAsyncStorage } from "next/dist/client/components/request-async-storage.external";

interface Props {
  currentUserId: string;
  accountId: string;
  areReplies?: boolean;
  isCircle?: boolean;
}

const LinesTab = async ({
  currentUserId,
  accountId,
  areReplies,
  isCircle,
}: Props) => {
  // TBC retireve the posts based on whether this is a user posts, community posts, or replies tab
  // if (isCircle) {
  //   fetchUserPosts(accountId);
  // } else {

  // }
  let result = await fetchUserPosts(accountId);

  return (
    <section className="mt-9 flex flex-col divide-y divide-solid divide-slate-800">
      {result.posts.map((line) => {
        // check if the post is active or not
        if (!line.active) {
          return;
        } else {
          // adjust the likes on the post
          let adjustedLikes = line.likes.map((like: any) => like.id);
          return (
            <LineCard
              key={line._id}
              id={line._id}
              currentUserId={currentUserId}
              parentId={line.parentId}
              text={line.text}
              media={line.media}
              author={
                !areReplies && !isCircle
                  ? {
                      id: result.id,
                      name: result.name,
                      image: result.image,
                    }
                  : {
                      id: line.author.id,
                      name: line.author.name,
                      image: line.author.image,
                    }
              }
              circle={
                isCircle
                  ? {
                      _id: result._id,
                      name: result.name,
                      image: result.image,
                    }
                  : line.circle
              }
              createdAt={line.createdAt}
              adjustedLikes={adjustedLikes}
              editedAt={line.editedAt}
              active={line.active}
              comments={line.children}
            />
          );
        }
      })}
    </section>
  );
};

export default LinesTab;
