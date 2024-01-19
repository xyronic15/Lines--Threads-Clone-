import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser } from "@/lib/actions/user.actions";
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
    currUserInfo?.id === user.id ? currUserInfo : await fetchUser(params.id);

  console.log(userInfo);
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
      />
    </section>
  );
};

export default Page;
