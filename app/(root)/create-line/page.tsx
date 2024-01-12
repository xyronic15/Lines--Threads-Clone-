import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import PostLine from "@/components/forms/PostLine";

const Page = async () => {
  // get the current user
  const user = await currentUser();
  if (!user) return null;

  // retrieve the user from mongodb and check if onboarded
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const lineInfo = {
    id: "",
    text: "",
    media: [],
    circleId: "",
  }

  return (
    <>
      <h1>Create a line</h1>

      <PostLine userId={userInfo._id} line={lineInfo} btnTitle="Post" />
    </>
  );
};

export default Page;
