import Link from "next/link";
import Image from "next/image";
import {
  KickMemberButton,
  MakeAdminButton,
  RemoveAdminButton,
} from "@/components/shared/MembersTabButtons";

interface Props {
  currentUserId: string;
  circleId: string;
  owner: {
    _id: string;
    id: string;
    username: string;
    name: string;
    image: string;
  };
  admins: {
    _id: string;
    id: string;
    username: string;
    name: string;
    image: string;
  }[];
  members: {
    _id: string;
    id: string;
    username: string;
    name: string;
    image: string;
  }[];
}

const MembersTab = ({
  currentUserId,
  circleId,
  owner,
  admins,
  members,
}: Props) => {
  // const pathname = usePathname();
  const isOwner = currentUserId === owner.id;
  const isAdmin = admins.some((admin) => admin.id === currentUserId);
  return (
    <>
      <section className="mt-9 flex flex-col divide-y divide-solid divide-slate-800">
        <h1>Admins</h1>
        {admins.map((admin) => (
          <article
            className="flex w-full flex-col sm:flex-row gap-4 p-7"
            key={admin.id}
          >
            <div className="flex items-center align-middle">
              <Link
                href={`/profile/${admin.id}`}
                className="relative h-11 w-11"
              >
                <Image
                  src={admin.image}
                  alt={admin.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="cursor-pointer rounded-full"
                />
              </Link>
            </div>
            <div className="flex w-full flex-col">
              <Link href={`/profile/${admin.id}`}>
                <p className="text-white cursor-pointer">{admin.name}</p>
                <p className="text-gray-500">@{admin.username}</p>
              </Link>
            </div>
            <div className="flex flex-row items-center align-middle gap-2">
              {currentUserId !== admin.id && isOwner && (
                <>
                  <RemoveAdminButton userId={admin.id} circleId={circleId} />
                  <KickMemberButton userId={admin.id} circleId={circleId} />
                </>
              )}
            </div>
          </article>
        ))}
      </section>
      <section className="mt-9 flex flex-col divide-y divide-solid divide-slate-800">
        <h1>Members</h1>
        {members.map((member) => (
          <article
            className="flex w-full flex-col sm:flex-row gap-4 p-7"
            key={member.id}
          >
            <div className="flex items-center align-middle">
              <Link
                href={`/profile/${member.id}`}
                className="relative h-11 w-11"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  style={{ objectFit: "cover" }}
                  className="cursor-pointer rounded-full"
                />
              </Link>
            </div>
            <div className="flex w-full flex-col">
              <Link href={`/profile/${member.id}`}>
                <p className="text-white cursor-pointer">{member.name}</p>
                <p className="text-gray-500">@{member.username}</p>
              </Link>
            </div>
            <div className="flex flex-row items-center align-middle gap-2">
              {(isAdmin || isOwner) && (
                <>
                  <MakeAdminButton userId={member.id} circleId={circleId} />
                  <KickMemberButton userId={member.id} circleId={circleId} />
                </>
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  );
};

export default MembersTab;
