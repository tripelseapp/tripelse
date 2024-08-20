"use client";

import { redirect } from "next/navigation";
import AccessStep from "./steps/Access";
import IdentificationStep from "./steps/Identification";

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
        {globalError && <small className="text-error">{globalError}</small>}
      </header>

      {!hasUser ? (
        <IdentificationStep
          onSubmit={(value) => {
            console.log(value);
          }}
        />
      ) : (
        <AccessStep
          userName={searchParams.user as string}
          onSubmit={() => {}}
        />
      )}
    </div>
  );
}
