import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LinesTab from "@/components/shared/LinesTab";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import { fetchCircle } from "@/lib/actions/circle.actions";

const Page = async ({ params }: { params: { id: string } }) => {
  // get the current user
  const user = await currentUser();
  if (!user) return null;

  // retrieve the current user from mongodb and check if onboarded
  const currUserInfo = await fetchUser(user.id);
  if (!currUserInfo?.onboarded) redirect("/onboarding");

  // fetch the circle using the given id
  const [circle, owner, admins, members] = await fetchCircle(params.id);

  // check if the current user is a member or admin of this circle
  const isFollowingMember =
    admins.some((admin: any) => admin.id === currUserInfo.id) ||
    members.some((member: any) => member.id === currUserInfo.id);

  return (
    <section>
      <ProfileHeader
        accountId={circle._id}
        currentUserId={currUserInfo.id}
        name={circle.name}
        username={circle.username}
        image={circle.image}
        bio={circle.bio}
        isFollowingMember={isFollowingMember}
        isCircle
        ownerId={owner.id}
        admins={admins.map((admin) => admin.id)}
        members={members.length}
      />
    </section>
  );
};

export default Page;
