"use client";

import { useState, useEffect, useRef } from "react";
import { createEvent } from "@/app/actions/events";
import { useRouter } from "next/navigation";

export default function EventModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Handle Escape key press
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Focus trap: keep focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modal.addEventListener("keydown", handleTabKey);
    firstElement?.focus();

    return () => {
      modal.removeEventListener("keydown", handleTabKey);
    };
  }, [isOpen]);

  // Focus first input when modal opens and reset state
  useEffect(() => {
    if (isOpen) {
      setLoading(false);
      setError(null);
      if (firstInputRef.current) {
        setTimeout(() => firstInputRef.current?.focus(), 100);
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createEvent(formData);

    if (result.success) {
      setIsOpen(false);
      e.currentTarget.reset();
      router.refresh();
    } else {
      setError(result.error || "Failed to create event");
    }

    setLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setError(null);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-gradient-to-r from-reindeer-green-600 to-reindeer-green-500 text-white rounded-lg hover:from-reindeer-green-700 hover:to-reindeer-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-green-500 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
        aria-label="Add new event"
      >
        Add Event
      </button>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-reindeer-navy-900 bg-opacity-75 z-40 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          ref={modalRef}
          className="bg-reindeer-cream-50 rounded-xl shadow-2xl max-w-md w-full p-6 border-4 border-reindeer-gold-400"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4 pb-3 border-b-2 border-reindeer-gold-200">
            <h3 id="modal-title" className="text-2xl font-bold text-reindeer-navy-900">
              Add New Event
            </h3>
            <button
              onClick={handleClose}
              className="text-reindeer-navy-600 hover:text-reindeer-red-600 focus:outline-none focus:ring-2 focus:ring-reindeer-red-500 rounded-full p-1 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                id="error-message"
                className="bg-reindeer-red-50 border-2 border-reindeer-red-300 text-reindeer-red-800 px-4 py-3 rounded-lg shadow-md"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-reindeer-navy-800 mb-2"
              >
                Event Name
              </label>
              <input
                ref={firstInputRef}
                type="text"
                id="name"
                name="name"
                required
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "error-message" : undefined}
                className="w-full px-4 py-2 border-2 border-reindeer-gold-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-reindeer-green-500 focus:border-reindeer-green-500 bg-white text-reindeer-navy-900"
                placeholder="Enter event name"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-reindeer-navy-800 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                aria-required="true"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "error-message" : undefined}
                rows={4}
                className="w-full px-4 py-2 border-2 border-reindeer-gold-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-reindeer-green-500 focus:border-reindeer-green-500 bg-white text-reindeer-navy-900"
                placeholder="Enter event description"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t-2 border-reindeer-gold-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-sm font-semibold text-reindeer-navy-700 bg-white border-2 border-reindeer-navy-300 rounded-lg hover:bg-reindeer-navy-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-navy-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-reindeer-green-600 to-reindeer-green-500 rounded-lg hover:from-reindeer-green-700 hover:to-reindeer-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-reindeer-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                aria-busy={loading}
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

