import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Edit = async () => {
  const user = await currentUser();
  if (!user) return null;

  // retrieve the user from mongodb and get the info
  const userInfo = await fetchUser(user.id);

  // if the user is not onboarded then redirect to "/onboarding"
  if (!userInfo.onboarded) redirect("/onboarding");

  const userData = {
    id: user?.id,
    objectId: userInfo?._id,
    username: userInfo?.username || user?.username,
    name: userInfo?.name || user?.firstName || "",
    bio: userInfo?.bio || "",
    image: userInfo?.image || user?.imageUrl,
  };

  return (
    <>
      <h1>Edit your profile</h1>

      <section className="mt-9 p-10">
        <AccountProfile user={userData} btnTitle="Save" />
      </section>
    </>
  );
};

export default Edit;
