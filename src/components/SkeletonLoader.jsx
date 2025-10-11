import React from 'react';

const CardPlaceholder = () => (
  <article
    className="h-full rounded-lg border border-gray-800/60 bg-card/40 p-6 animate-pulse"
    aria-hidden="true"
    role="status"
  >
    <div className="h-6 bg-gray-800 rounded-md w-3/4 mb-4" />
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-gray-800" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-800 rounded w-1/3" />
        <div className="h-3 bg-gray-800 rounded w-1/4" />
      </div>
    </div>

    <div className="space-y-2 mb-6">
      <div className="h-3 bg-gray-800 rounded w-full" />
      <div className="h-3 bg-gray-800 rounded w-5/6" />
      <div className="h-3 bg-gray-800 rounded w-3/4" />
    </div>

    <div className="h-10 w-36 rounded-md bg-gray-800" />
  </article>
);

export default function HomeSkeleton() {
  return (
    <main className="min-h-screen bg-[#0b0b0c] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* spacer for top nav */}
        <div className="h-12" />

        {/* HERO */}
        <header className="text-center mb-12">
          <div className="mx-auto max-w-3xl">
            <div className="h-16 rounded-md bg-gray-900 w-2/3 mx-auto mb-6" />
            <div className="h-4 rounded-md bg-gray-900 w-1/2 mx-auto" />
          </div>
        </header>

        {/* POSTS GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <CardPlaceholder key={i} />
          ))}
        </section>

        {/* stacked posts below */}
        <section className="mt-10 space-y-6">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="rounded-lg border border-gray-800/60 bg-card/40 p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-900 rounded w-1/2 mb-4" />
              <div className="h-4 bg-gray-900 rounded w-full mb-2" />
              <div className="h-4 bg-gray-900 rounded w-5/6 mb-4" />

              <div className="flex items-center gap-4 mt-6">
                <div className="w-8 h-8 rounded-full bg-gray-900" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-900 rounded w-1/3" />
                </div>
                <div className="h-8 w-24 rounded-md bg-gray-900" />
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
