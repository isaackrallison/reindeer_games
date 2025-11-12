import { getEvents, type EventWithSuggester } from "@/app/actions/events";
import Link from "next/link";

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
    // Check if it's an authentication error (user not logged in)
    if (result.error === "Authentication failed") {
      return (
        <div className="text-center py-12">
          <div className="bg-reindeer-gold-50 border-2 border-reindeer-gold-300 rounded-xl p-8 max-w-md mx-auto shadow-md">
            <h3 className="text-xl font-semibold text-reindeer-navy-900 mb-3">
              Welcome to Reindeer Games!
            </h3>
            <p className="text-reindeer-navy-700 mb-6">
              Sign in to view and suggest events for the group.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login"
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-reindeer-green-600 to-reindeer-green-500 rounded-lg hover:from-reindeer-green-700 hover:to-reindeer-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-green-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 text-sm font-semibold text-reindeer-navy-900 bg-white border-2 border-reindeer-gold-400 rounded-lg hover:bg-reindeer-cream-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-gold-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // For other errors, show the error message
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
      {events.map((event: EventWithSuggester) => (
        <div
          key={event.id}
          className="bg-white rounded-lg shadow-md p-6 border-2 border-reindeer-gold-200 hover:border-reindeer-gold-400 hover:shadow-xl transition-all duration-200"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-reindeer-navy-900">{event.name}</h3>
            <div className="text-right">
              <time className="text-sm text-reindeer-navy-600 font-medium block" dateTime={event.created_at}>
                {formatDate(event.created_at)}
              </time>
              {event.suggester_name && (
                <p className="text-xs text-reindeer-navy-500 mt-1">
                  Suggested by {event.suggester_name}
                </p>
              )}
            </div>
          </div>
          <p className="text-reindeer-navy-700">{event.description}</p>
        </div>
      ))}
    </div>
  );
}

