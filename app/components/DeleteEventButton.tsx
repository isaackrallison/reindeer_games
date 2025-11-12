"use client";

import { useState } from "react";
import { deleteEvent } from "@/app/actions/events";
import { useRouter } from "next/navigation";

interface DeleteEventButtonProps {
  eventId: string;
  eventName: string;
}

export default function DeleteEventButton({
  eventId,
  eventName,
}: DeleteEventButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    const result = await deleteEvent(eventId);

    if (!result.success) {
      setError(result.error || "Failed to delete event");
      setLoading(false);
      setShowConfirm(false);
    } else {
      router.refresh();
    }
  };

  if (showConfirm) {
    return (
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <p className="text-sm text-reindeer-navy-700">
          Delete &quot;{eventName}&quot;?
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium text-white bg-reindeer-red-600 rounded-md hover:bg-reindeer-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Deleting..." : "Yes, delete"}
          </button>
          <button
            onClick={() => {
              setShowConfirm(false);
              setError(null);
            }}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium text-reindeer-navy-700 bg-white border border-reindeer-gold-300 rounded-md hover:bg-reindeer-cream-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
        {error && (
          <p className="text-xs text-reindeer-red-600 mt-1">{error}</p>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="px-3 py-1.5 text-xs font-medium text-reindeer-red-600 bg-reindeer-red-50 border border-reindeer-red-300 rounded-md hover:bg-reindeer-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-red-500 transition-colors"
      aria-label={`Delete event ${eventName}`}
    >
      Delete
    </button>
  );
}

