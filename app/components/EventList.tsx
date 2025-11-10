import { getEvents } from "@/app/actions/events";

export default async function EventList() {
  const events = await getEvents();

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
            <span className="text-sm text-gray-500">
              {new Date(event.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700">{event.description}</p>
        </div>
      ))}
    </div>
  );
}

