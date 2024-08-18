import { apiCall, RequestParams } from "~/utils/apiCall";

const endpoint = "/api/v1/trip";

type GetUserOptions = RequestParams<typeof endpoint, "get">;
async function getTrips(options: GetUserOptions = {}) {
  try {
    const trips = await apiCall(endpoint, "get", options);
    return trips;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export default async function HomePage() {
  const users = await getTrips({ page: 1, take: 2 });
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <pre>{JSON.stringify(users, null, 2)}</pre>
      </div>
    </main>
  );
}
