import Link from "next/link";
import { routes } from "~/constants/routes";

export default function HomePage(): React.JSX.Element {
  return (
    <main className="h-screen w-full space-y-6 p-6 md:max-w-xl">
      <div className="grid h-full w-full grid-rows-[1fr,auto] gap-4">
        <div className="flex flex-col gap-4">
          <div className="h-[270px] w-full rounded-2xl bg-lime-300"></div>
          <hgroup className="flex w-full flex-col">
            <strong className="text-2xl opacity-75">Welcome to</strong>
            <h1 className="text-4xl font-bold">Tripelse</h1>
          </hgroup>
        </div>

        <Link
          href={routes.dashboard}
          className="container flex w-full flex-col items-center justify-center gap-12 rounded-xl bg-lime-400 px-2 py-3 text-lg font-semibold"
        >
          Continue
        </Link>
      </div>
    </main>
  );
}
