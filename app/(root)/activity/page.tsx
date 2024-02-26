import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getActivity } from "@/lib/actions/user.actions";
import Link from "next/link";
import LineCard from "@/components/cards/LineCard";
import FollowCard from "@/components/cards/FollowCard";
import { getFollowing } from "@/lib/actions/follow.actions";

const Page = async () => {
  // get the current user
  const user = await currentUser();
  if (!user) return null;

  // retrieve the user from mongodb and check if onboarded
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  //   get the ser that the curr user is following
  const following = await getFollowing(user.id);
  console.log(following);

  //   get the activity of the user
  const activity = await getActivity(user.id);
  return (
    <section className="mt-9 flex flex-col divide-y divide-solid divide-slate-800">
      <h1 className="text-2xl font-bold mb-9">Activity</h1>

      {activity.map((act: any) => {
        if (act.type === "comment" && act.reply.active) {
          // adjust the likes on the post
          let adjustedLikes = act.reply.likes.map((like: any) => like.id);

          return (
            <Link
              href={`/line/${act.reply.parentId}`}
              className="hover:bg-slate-800 transition-all duration-150"
            >
              <LineCard
                key={act.reply._id}
                id={act.reply._id}
                currentUserId={user.id}
                parentId={act.reply.parentId}
                text={act.reply.text}
                media={act.reply.media}
                author={{
                  id: act.reply.author.id,
                  name: act.reply.author.name,
                  image: act.reply.author.image,
                }}
                circle={null}
                createdAt={act.reply.createdAt}
                adjustedLikes={adjustedLikes}
                editedAt={act.reply.editedAt}
                active={act.reply.active}
                comments={act.reply.children}
              />
            </Link>
          );
        } else if (act.type === "follow") {
          // check if the current user is following the given user
          const isFollowed = following.some(
            (follow) => follow.following.id === act.follow.follower.id
          );

          return (
            <FollowCard
              key={act.follow._id}
              followerId={act.follow.follower.id}
              currentUserId={user.id}
              name={act.follow.follower.name}
              username={act.follow.follower.username}
              bio={act.follow.follower.bio}
              image={act.follow.follower.image}
              isFollowed={isFollowed}
            />
          );
        }
      })}
    </section>
  );
};

export default Page;
