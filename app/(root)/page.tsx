import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Image from "next/image";
import LinesTab from "@/components/shared/LinesTab";

const Home = async () => {
  // get the current user
  const user = await currentUser();
  if (!user) return null;

  // retrieve the user from mongodb and check if onboarded
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1>Home</h1>
      <LinesTab currentUserId={user.id} areReplies={false} isHome />
    </>
  );
};

export default Home;
