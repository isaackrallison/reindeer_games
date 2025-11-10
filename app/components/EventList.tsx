import { getEvents } from "@/app/actions/events";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = date.getDate();
  return `${month} ${day}, ${year}`;
}

export default async function EventList() {
  const result = await getEvents();

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
          <p className="font-medium">Error loading events</p>
          <p className="text-sm mt-1">{result.error}</p>
        </div>
      </div>
    );
  }

  const events = result.data || [];

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No events yet. Be the first to add one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg shadow p-6 border border-gray-200"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{event.name}</h3>
            <time className="text-sm text-gray-500" dateTime={event.created_at}>
              {formatDate(event.created_at)}
            </time>
          </div>
          <p className="text-gray-700">{event.description}</p>
        </div>
      ))}
    </div>
  );
}

