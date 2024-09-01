"use client";

import AccessStep from "./steps/2-access/access";
import IdentificationStep from "./steps/1-Identification/identification";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const hasUser = searchParams.user;
  const globalError = searchParams.globalError;

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <header className="flex items-center gap-2">
        <div className="h-[25px] w-[25px] rounded-2xl bg-primary-300"></div>
        <h1 className="text-2xl font-bold">Tripelse</h1>
      </header>

      <header className="h-fit w-full pb-4">
        {globalError ? (
          <small className="text-error">{globalError}</small>
        ) : null}
      </header>

      {!hasUser ? (
        <IdentificationStep />
      ) : (
        <AccessStep
          onSubmit={() => {}}
          userName={searchParams.user as string}
        />
      )}
    </div>
  );
}
