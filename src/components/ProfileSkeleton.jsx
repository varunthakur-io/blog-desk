import React from 'react';

const StatPill = ({ className = '' }) => (
  <div className={`h-10 w-20 rounded-full bg-gray-800 ${className}`} />
);

const PostCardSmall = () => (
  <article className="rounded-lg border border-gray-800/60 bg-card/40 p-4 animate-pulse">
    <div className="h-4 bg-gray-800 rounded w-3/4 mb-3" />
    <div className="h-3 bg-gray-800 rounded w-full mb-2" />
    <div className="h-3 bg-gray-800 rounded w-5/6 mb-4" />
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-800" />
        <div className="h-3 bg-gray-800 rounded w-24" />
      </div>
      <div className="h-8 w-20 rounded-md bg-gray-800" />
    </div>
  </article>
);

export default function ProfileSkeleton() {
  return (
    <main className="min-h-screen bg-[#0b0b0c] text-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="w-28 h-28 rounded-full bg-gray-800 animate-pulse" />
            <div className="flex-1 min-w-0">
              <div className="h-6 bg-gray-800 rounded w-48 mb-3 animate-pulse" />
              <div className="h-4 bg-gray-800 rounded w-40 animate-pulse" />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-4 w-full md:w-auto">
            <div className="hidden md:flex items-center gap-4">
              <StatPill />
              <StatPill />
              <StatPill />
            </div>
            <div className="h-10 w-24 rounded-md bg-gray-800 animate-pulse" />
          </div>
        </div>

        {/* Bio */}
        <div className="max-w-2xl mb-8 space-y-3">
          <div className="h-4 bg-gray-800 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-800 rounded w-5/6 animate-pulse" />
          <div className="h-3 bg-gray-800 rounded w-2/3 animate-pulse" />
        </div>

        {/* Tabs + posts */}
        <div className="space-y-6">
          <div className="flex items-center gap-4 border-b border-gray-800/60 pb-4">
            <div className="h-10 w-28 rounded-md bg-gray-800 animate-pulse" />
            <div className="h-10 w-28 rounded-md bg-gray-800 animate-pulse" />
            <div className="h-10 w-28 rounded-md bg-gray-800 animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <PostCardSmall key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
