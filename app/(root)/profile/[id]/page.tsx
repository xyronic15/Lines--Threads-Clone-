import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LinesTab from "@/components/shared/LinesTab";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { getFollowers, getFollowing } from "@/lib/actions/follow.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  // get the current user
  const user = await currentUser();
  if (!user) return null;

  // retrieve the current user from mongodb and check if onboarded
  const currUserInfo = await fetchUser(user.id);
  if (!currUserInfo?.onboarded) redirect("/onboarding");

  // get the user info using the given id
  // if the current user's id is the same then just use their info
  // else retrieve the user info using the given id
  const userInfo =
    currUserInfo?.id === params.id ? currUserInfo : await fetchUser(params.id);

  // get the followers and the following of the user
  const followers = await getFollowers(userInfo.id);
  const following = await getFollowing(userInfo.id);

  // check if the current user is following the given user
  const isFollowingMember = followers.some(
    (follower) => follower.follower.id === currUserInfo.id
  );

  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        currentUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        image={userInfo.image}
        bio={userInfo.bio}
        postCounts={userInfo.posts.length}
        followers={followers.length}
        following={following.length}
        circles={userInfo.circles.length}
        isFollowingMember={isFollowingMember}
      />

      <div className="mt-9">
        <Tabs defaultValue="lines" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="tab">
                {tab.icon}

                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Lines" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo.posts.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent key={`${tab.value}-content`} value={tab.value}>
              {/* LinesTab for user posts and replies */}
              <LinesTab
                currentUserId={user.id}
                accountId={userInfo.id}
                areReplies={tab.value === "replies"}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Page;
