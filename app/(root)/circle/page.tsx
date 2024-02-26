import ProfilesTab from "@/components/shared/ProfilesTab";
import SearchBar from "@/components/shared/SearchBar";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  // get the current user
  const user = await currentUser();
  if (!user) return null;

  // retrieve the user from mongodb and check if onboarded
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");
  return (
    <section className="mt-9 relative flex flex-col h-[75vh]">
      <h1>Search for Circles</h1>
      <SearchBar route="circle" />

      <div className="mt-9 overflow-y-scroll h-full">
        <ProfilesTab
          currentUserId={user.id}
          query={searchParams.q || ""}
          type="circles"
        />
      </div>
    </section>
  );
};

export default Page;
