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
        <div className="bg-reindeer-red-50 border-2 border-reindeer-red-200 text-reindeer-red-800 px-4 py-3 rounded-lg max-w-md mx-auto shadow-md">
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
        <p className="text-reindeer-navy-600 text-lg font-medium">
          No events yet. Be the first to add one!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg shadow-md p-6 border-2 border-reindeer-gold-200 hover:border-reindeer-gold-400 hover:shadow-xl transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-reindeer-navy-900">{event.name}</h3>
            <time className="text-sm text-reindeer-navy-600 font-medium" dateTime={event.created_at}>
              {formatDate(event.created_at)}
            </time>
          </div>
          <p className="text-reindeer-navy-700">{event.description}</p>
        </div>
      ))}
    </div>
  );
}

