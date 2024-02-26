import LineCard from "@/components/cards/LineCard";
import { fetchCirclePosts } from "@/lib/actions/circle.actions";
import { searchPosts, fetchHomePosts } from "@/lib/actions/post.actions";
import { fetchUserPosts, getReplies } from "@/lib/actions/user.actions";
import { requestAsyncStorage } from "next/dist/client/components/request-async-storage.external";
import Link from "next/link";
import { MdAdminPanelSettings } from "react-icons/md";

interface Props {
  currentUserId: string;
  accountId?: string;
  query?: string;
  areReplies: boolean;
  isSearch?: boolean;
  isCircle?: boolean;
  isHome?: boolean;
  admin?: boolean;
  results?: any;
}

const LinesTab = async ({
  currentUserId,
  accountId,
  query,
  areReplies,
  isSearch,
  isCircle,
  isHome,
  admin,
}: Props) => {
  // retrieve the posts based on whether this is a user posts, community posts, or replies tab
  let result: any;

  if (isHome) {
    let followingPosts: any, circlePosts: any, latestPosts: any;
    [followingPosts, circlePosts, latestPosts] = await fetchHomePosts(
      currentUserId
    );

    // combine the followingPosts and circlePosts then sort by date
    let personalizedPosts = [...followingPosts, ...circlePosts];
    personalizedPosts.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // concatenate the latest posts to the end of the personalizedPosts
    result = { posts: [...personalizedPosts, ...latestPosts] };
    // console.log(result);
  } else if (isSearch) {
    result = await searchPosts(query);
  } else if (isCircle) {
    result = await fetchCirclePosts(accountId);
  } else if (areReplies) {
    result = await getReplies(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  return (
    <section className="mt-9 flex flex-col divide-y divide-solid divide-slate-800">
      {areReplies ? (
        <Replies currentUserId={currentUserId} results={result} />
      ) : (
        <Lines
          currentUserId={currentUserId}
          areReplies={areReplies}
          isSearch={isSearch}
          isCircle={isCircle}
          isHome={isHome}
          admin={admin}
          results={result}
        />
      )}
    </section>
  );
};

// All lines component that takes the results and returns a map of lines
const Lines = ({
  currentUserId,
  areReplies,
  isSearch,
  isCircle,
  isHome,
  admin,
  results,
}: Props) => {
  return (
    <>
      {results?.posts.length !== 0 ? (
        results.posts.map((line) => {
          // check if the post is active or not
          if (!line.active) {
            return;
          } else {
            // adjust the likes on the post
            let adjustedLikes = line.likes.map((like: any) => like.id);

            return (
              <Link
                href={`/line/${line.parentId ? line.parentId : line._id}`}
                // className="hover:bg-slate-800 transition-all duration-150"
              >
                <LineCard
                  key={line._id}
                  id={line._id}
                  currentUserId={currentUserId}
                  parentId={line.parentId}
                  text={line.text}
                  media={line.media}
                  author={
                    !areReplies && !isCircle && !isSearch && !isHome
                      ? {
                          id: results.id,
                          name: results.name,
                          image: results.image,
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
                          _id: results._id,
                          name: results.name,
                          image: results.image,
                        }
                      : line.circle
                  }
                  createdAt={line.createdAt}
                  adjustedLikes={adjustedLikes}
                  editedAt={line.editedAt}
                  active={line.active}
                  comments={line.children}
                  admin={admin}
                />
              </Link>
            );
          }
        })
      ) : (
        <p className="text-white">No Result</p>
      )}
    </>
  );
};

// All replies component that takes the results and returns a map of replies
const Replies = ({ currentUserId, results }: Props) => {
  return (
    <>
      {results.map((line) => {
        // check if the post is active or not
        if (!line.active) {
          return;
        } else {
          // adjust the likes on the post
          let adjustedLikes = line.likes.map((like: any) => like.id);

          return (
            <Link
              href={`/line/${line.parentId}`}
              className="hover:bg-slate-800 transition-all duration-150"
            >
              <LineCard
                key={line._id}
                id={line._id}
                currentUserId={currentUserId}
                parentId={line.parentId}
                text={line.text}
                media={line.media}
                author={{
                  id: line.author.id,
                  name: line.author.name,
                  image: line.author.image,
                }}
                circle={line.circle}
                createdAt={line.createdAt}
                adjustedLikes={adjustedLikes}
                editedAt={line.editedAt}
                active={line.active}
                comments={line.children}
              />
            </Link>
          );
        }
      })}
    </>
  );
};

export default LinesTab;
