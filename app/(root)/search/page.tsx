import LinesTab from "@/components/shared/LinesTab";
import ProfilesTab from "@/components/shared/ProfilesTab";
import SearchBar from "@/components/shared/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { searchTabs } from "@/constants";
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
      <h1>Search</h1>
      <SearchBar route="search" />

      <div className="mt-9 overflow-y-scroll h-full">
        <Tabs defaultValue="lines" className="w-full">
          <TabsList className="tab">
            {searchTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="tab">
                {tab.icon}

                <p className="max-sm:hidden">{tab.label}</p>
              </TabsTrigger>
            ))}
          </TabsList>
          {searchTabs.map((tab) => (
            <TabsContent key={`${tab.value}-content`} value={tab.value}>
              {tab.label === "Lines" ? (
                <LinesTab
                  currentUserId={user.id}
                  query={searchParams.q}
                  areReplies={false}
                  isSearch
                />
              ) : (
                <ProfilesTab
                  currentUserId={user.id}
                  query={searchParams.q || ""}
                  type="users"
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      {/* <LinesTab
          currentUserId={user.id}
          query={searchParams.q}
          areReplies={false}
          isSearch
        /> */}
    </section>
  );
};

export default Page;
