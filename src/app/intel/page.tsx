"use client";

import { useState } from "react";
import { format } from "date-fns";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";

export default function IntelListPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    undefined,
  );
  const [limit, setLimit] = useState(12);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const subjectsQuery = api.post.getSubjects.useQuery();
  const intelQuery = api.intel.getLatestIntel.useQuery({
    limit,
    subject: selectedSubject,
  });

  function toggleExpand(id: string) {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div className="min-h-screen bg-black p-8 text-red-500">
      <div className="mx-auto max-w-6xl">
        <h1 className="glitch mb-6 text-3xl">MEGACORP INTEL ARCHIVE</h1>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3">
            <label className="text-sm text-red-400">DIVISION</label>
            <select
              value={selectedSubject ?? ""}
              onChange={(e) => setSelectedSubject(e.target.value || undefined)}
              className="rounded border border-red-800 bg-gray-800 p-2 text-red-500"
            >
              <option value="">All</option>
              {subjectsQuery.data?.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setLimit((l) => Math.max(6, l - 6))}
              className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
            >
              LOAD FEWER
            </Button>
            <Button
              onClick={() => setLimit((l) => l + 12)}
              className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
            >
              LOAD MORE
            </Button>
          </div>
        </div>

        {intelQuery.isLoading ? (
          <div>Downloading intelligence feed...</div>
        ) : intelQuery.data && intelQuery.data.length > 0 ? (
          <div className="space-y-6">
            {intelQuery.data.map((i) => (
              <article
                key={i.id}
                className="overflow-hidden rounded-lg border border-red-800 bg-gray-900 p-6"
              >
                <header className="mb-3 flex items-start justify-between">
                  <div>
                    <h2 className="glitch mb-1 text-2xl text-white">
                      {i.title}
                    </h2>
                    <div className="text-sm text-red-400">
                      {i.subject} • Difficulty {i.difficulty}
                    </div>
                  </div>
                  <div className="text-right text-sm text-red-400">
                    <div>{i.author?.username ?? "Unknown"}</div>
                    <div>
                      {format(new Date(i.createdAt), "LLL dd, yyyy HH:mm")}
                    </div>
                  </div>
                </header>

                <div className="mb-4 text-red-300">
                  {expanded[i.id]
                    ? i.content
                    : `${i.content.slice(0, 300)}${i.content.length > 300 ? "..." : ""}`}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-red-400">
                    {i.verifiedByModerator ? (
                      <span className="rounded bg-red-800 px-2 py-1 text-red-100">
                        VERIFIED
                      </span>
                    ) : (
                      <span className="rounded border border-red-700 px-2 py-1">
                        PENDING
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => toggleExpand(i.id)}
                      className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
                    >
                      {expanded[i.id] ? "HIDE" : "READ"}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-red-400">No intel available.</div>
        )}

        <div className="mt-8 text-center text-sm text-red-400">
          Browse responsibly. Leaking to corp channels will get you ghosted.
        </div>
      </div>
    </div>
  );
}
