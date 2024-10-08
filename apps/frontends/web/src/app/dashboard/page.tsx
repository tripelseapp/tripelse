// import { apiCall, RequestParams } from "~/utils/apiCall";

import { getToken } from "~/utils/auth/get-token";

// const endpoint = "/api/v1/trip";

// type GetUserOptions = RequestParams<typeof endpoint, "get">;
// async function getTrips(params?: GetUserOptions) {
//   try {
//     const trips = await apiCall({ url: endpoint });
//     return trips;
//   } catch (error) {
//     console.error(error);
//     return error;
//   }
// }

export default async function HomePage(): Promise<React.JSX.Element> {
  const token = await getToken();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        dashboard
        <pre>{JSON.stringify(token, null, 2)}</pre>
      </div>
    </main>
  );
}
