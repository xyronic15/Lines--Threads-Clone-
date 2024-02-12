import CircleProfile from "@/components/forms/CircleProfile";
import { fetchCircle } from "@/lib/actions/circle.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ searchParams }) => {
  const user = await currentUser();
  if (!user) return null;

  // retrieve the user from mongodb and get the info
  const userInfo = await fetchUser(user.id);

  // if the user is not onboarded then redirect to "/onboarding"
  if (!userInfo.onboarded) redirect("/onboarding");

  // retrieve circle details by id
  const [circle, owner, admins, members] = await fetchCircle(searchParams.id);

  // check if current user is the owner or an admin, redirect if not
  if (!admins.some((admin: any) => admin.id === userInfo.id))
    redirect(`/circle/${searchParams.id}`);

  const circleData = {
    id: circle._id,
    username: circle.username,
    name: circle.name,
    bio: circle.bio,
    image: circle.image,
  };

  return (
    <>
      <h1>Edit your Circle</h1>
      {/* CircleProfile */}
      <section className="mt-9 p-10">
        <CircleProfile userId={user.id} circle={circleData} btnTitle="Update" />
      </section>
    </>
  );
};

export default Page;
