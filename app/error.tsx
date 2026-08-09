"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <span className="text-5xl">🍽️</span>
      <h2 className="text-xl font-bold">Something didn&apos;t plate up right.</h2>
      <p className="text-muted text-sm max-w-sm">
        Let&apos;s try that again — your search is still saved.
      </p>
      <button
        onClick={reset}
        className="rounded-btn bg-accent text-white px-6 py-3 text-sm font-semibold shadow-card"
      >
        Try Again
      </button>
    </div>
  );
}
