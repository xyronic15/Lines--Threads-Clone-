import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import CircleProfile from "@/components/forms/CircleProfile";

const Page = async () => {
  // get the current user
  const user = await currentUser();
  if (!user) return null;

  // retrieve the user from mongodb and check if onboarded
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const circleData = {
    id: "",
    username: "",
    name: "",
    bio: "",
    image: "",
  };

  return (
    <>
      <h1>Create a Circle</h1>
      {/* CircleProfile */}
      <section className="mt-9 p-10">
        <CircleProfile userId={user.id} circle={circleData} btnTitle="Create" />
      </section>
    </>
  );
};

export default Page;
