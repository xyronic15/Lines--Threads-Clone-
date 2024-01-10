import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="mx-auto flex flex-col items-center w-full py-20">
      <SignUp />
    </main>
  );
}
