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

  //   TBC fetch the circle using the given id
  const [circle, owner, admins, members] = await fetchCircle(params.id);
  console.log(admins);

  return (
    <section>
      <h1>This is a circle</h1>
    </section>
  );
};

export default Page;
