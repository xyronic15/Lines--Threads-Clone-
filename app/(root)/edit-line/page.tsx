import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import PostLine from "@/components/forms/PostLine";
import { fetchPostById } from "@/lib/actions/post.actions";

const Page = async ({ searchParams }: { searchParams: { id: string } }) => {
  // get the current user
  const user = await currentUser();
  if (!user) return null;

  // retrieve the user from mongodb and check if onboarded
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  // get the post by id from mongodb
  const line = await fetchPostById(searchParams.id);

  //   redirect if the current user doesn't match the post's author
  if (line.author.id !== user.id) redirect("/");

  const lineInfo = {
    id: line._id,
    text: line.text,
    media: line.media,
  };

  return (
    <>
      <h1>Create a line</h1>

      <PostLine
        userId={userInfo._id}
        circleId={line.circle?._id}
        line={lineInfo}
        btnTitle="Update"
      />
    </>
  );
};

export default Page;
