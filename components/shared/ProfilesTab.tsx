import { searchCircles } from "@/lib/actions/circle.actions";
import { searchUsers, fetchUserCircles } from "@/lib/actions/user.actions";
import Link from "next/link";
import Image from "next/image";

interface Props {
  currentUserId: string;
  query: string;
  type: string;
}

const ProfilesTab = async ({ currentUserId, query, type }: Props) => {
  // retrieve users or circles based on type
  let users: any;
  let currentUserCircles: any;
  let circles: any;

  if (type === "users") {
    users = await searchUsers(currentUserId, query);
    // console.log(users);
  } else if (type === "circles") {
    circles = await searchCircles(query);
    currentUserCircles = await fetchUserCircles(currentUserId);
  }
  return (
    <>
      {type === "users" && <Users users={users} />}
      {type === "circles" && (
        <Circles
          currentUserCircles={currentUserCircles}
          circles={circles}
          query={query}
        />
      )}
    </>
  );
};

// all users component that takes the results and returns a map of users
const Users = ({ users }: any) => {
  return (
    <section className="mt-9 flex flex-col divide-y divide-solid divide-slate-800">
      {users.length !== 0 ? (
        users.map((user: any) => (
          <article
            className="flex w-full flex-col sm:flex-row gap-4 p-7"
            key={user.id}
          >
            <div className="flex items-center align-middle">
              <Link href={`/profile/${user.id}`} className="relative h-11 w-11">
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="cursor-pointer rounded-full"
                />
              </Link>
            </div>
            <div className="flex w-full flex-col">
              <Link href={`/profile/${user.id}`}>
                <p className="text-white cursor-pointer font-semibold">
                  {user.name}
                </p>
                <p className="text-gray-500">@{user.username}</p>
              </Link>
            </div>
          </article>
        ))
      ) : (
        <p className="text-white">No Result</p>
      )}
    </section>
  );
};

// all circles component that takes the results and returns a map of circles that the user is in and the ones from the search
const Circles = ({ currentUserCircles, circles, query }: any) => {
  return (
    <>
      <section className="mt-9 flex flex-col divide-y divide-solid divide-slate-800">
        <h1>Your circles</h1>
        {currentUserCircles.map((circle: any) => {
          let membersCount = circle.members.length + circle.admins.length;
          return (
            <article
              className="flex w-full flex-col sm:flex-row gap-4 p-7"
              key={circle._id}
            >
              <div className="flex items-center align-middle">
                <Link
                  href={`/circle/${circle._id}`}
                  className="relative h-11 w-11"
                >
                  <Image
                    src={circle.image}
                    alt={circle.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="cursor-pointer rounded-full"
                  />
                </Link>
              </div>
              <div className="flex w-full flex-col">
                <Link href={`/circle/${circle._id}`}>
                  <p className="text-white cursor-pointer font-semibold">
                    {circle.name}
                  </p>
                  <p className="text-gray-500">
                    @{circle.username} • {membersCount} members
                  </p>
                </Link>
              </div>
            </article>
          );
        })}
      </section>
      <section className="mt-9 flex flex-col divide-y divide-solid divide-slate-800">
        <h1>Results for: "{query}"</h1>
        {circles.map((circle: any) => {
          let membersCount = circle.members.length + circle.admins.length;
          return (
            <article
              className="flex w-full flex-col sm:flex-row gap-4 p-7"
              key={circle._id}
            >
              <div className="flex items-center align-middle">
                <Link
                  href={`/circle/${circle._id}`}
                  className="relative h-11 w-11"
                >
                  <Image
                    src={circle.image}
                    alt={circle.name}
                    fill
                    style={{ objectFit: "cover" }}
                    className="cursor-pointer rounded-full"
                  />
                </Link>
              </div>
              <div className="flex w-full flex-col">
                <Link href={`/circle/${circle._id}`}>
                  <p className="text-white cursor-pointer font-semibold">
                    {circle.name}
                  </p>
                  <p className="text-gray-500">
                    @{circle.username} • {membersCount} members
                  </p>
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
};

export default ProfilesTab;
