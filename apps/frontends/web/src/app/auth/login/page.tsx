"use client";

import AccessStep from "./steps/access";
import IdentificationStep from "./steps/identification";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const hasUser = searchParams.user;
  const globalError = searchParams.globalError;

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <header className="h-fit w-full pb-4">
        {globalError ? (
          <small className="text-error">{globalError}</small>
        ) : null}
      </header>

      {!hasUser ? (
        <IdentificationStep
          onSubmit={(value) => {
            console.log(value);
          }}
        />
      ) : (
        <AccessStep
          onSubmit={() => {}}
          userName={searchParams.user as string}
        />
      )}
    </div>
  );
}
