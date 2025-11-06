import UserStatus from "@/components/UserStatus";
import Link from "next/link";

export default function Home() {


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <UserStatus />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome Home!
          </h1>
          <Link style={{ color: "blue" }} href={'/users'}>Users</Link>
          <Link style={{ color: 'blue' }} href={'/products'}>Products</Link>
        </div>
      </main>
    </div>
  );
}
