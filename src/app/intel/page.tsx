"use client";

import { useState } from "react";
import { addDays, format } from "date-fns";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { type DateRange } from "react-day-picker";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";
import { Calendar } from "lucide-react";

import { Calendar as CalendarComponent } from "~/components/ui/calendar";

import CommentList from "../_components/intelpost/commentList";
import Link from "next/link";

export default function IntelListPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(Date.UTC(2024, 8, 1)),
    to: addDays(new Date(), 3),
  });
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(
    "All",
  );
  const [limit, setLimit] = useState(12);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const subjectsQuery = api.post.getSubjects.useQuery();
  const intelQuery = api.intel.getLatestIntel.useQuery({
    limit,
    subject: selectedSubject ?? "All",
    from: dateRange?.from,
    to: dateRange?.to,
  });

  function toggleExpand(id: string) {
    setExpanded((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div className="min-h-screen bg-black p-8 text-red-500">
      <div className="mx-auto max-w-6xl">
        <h1 className="glitch mb-6 text-3xl">MEGACORP INTEL ARCHIVE</h1>
        {/* {intelQuery.error && (
          <div className="mt-4 text-red-600">{intelQuery.error.message}</div>
        )} */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="mx-auto flex w-[150px] flex-col items-center md:w-auto md:flex-row md:space-x-3">
            <label className="text-sm text-red-400">DIVISION</label>
            <select
              value={selectedSubject ?? ""}
              onChange={(e) => setSelectedSubject(e.target.value || undefined)}
              className="w-auto rounded border border-red-800 bg-gray-800 p-2 text-red-500 md:w-[300px]"
            >
              {subjectsQuery.data?.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col items-center space-x-3 md:flex-row">
            <div className="my-2">LIMIT:{limit}</div>
            <Button
              onClick={() => setLimit((l) => Math.max(6, l - 6))}
              className="my-2 border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
            >
              LOAD FEWER
            </Button>
            <Button
              onClick={() => setLimit((l) => l + 12)}
              className="my-2 border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
            >
              LOAD MORE
            </Button>
          </div>
        </div>
        <div className="mb-6 flex-col space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-[300px] justify-start border border-red-800 bg-gray-900 text-left font-normal text-red-500 ${
                  !dateRange ? "text-muted-foreground" : ""
                }`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")}
                      <span className="text-muted-foreground mx-2">–</span>
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border-red-800 bg-gray-900 p-0">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                className="calendar-transition"
              />
            </PopoverContent>
          </Popover>
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
                      {i.name}
                    </h2>

                    {/* <div className="text-sm text-red-400">
                      {i.subject} • Difficulty {i.difficulty}
                    </div> */}
                  </div>
                  <div className="text-right text-sm text-red-400">
                    <div>{i.poster ?? "Unknown"}</div>
                    <div>
                      {format(new Date(i.createdAt), "LLL dd, yyyy HH:mm")}
                    </div>
                  </div>
                </header>
                <div className="mb-4 text-red-300">
                  {expanded[i.id]
                    ? i.text
                    : `${i.text.slice(0, 300)}${i.text.length > 300 ? "..." : ""}`}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-red-400">
                    {i.verifiedByModerator ? (
                      <span className="rounded bg-red-800 px-2 py-1 text-red-100">
                        VERIFIED
                      </span>
                    ) : (
                      <span className="rounded px-2 py-1 md:border md:border-red-700">
                        PENDING VERIFICATION
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => toggleExpand(i.id)}
                      className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
                    >
                      <div>{expanded[i.id] ? "HIDE" : "READ"}</div>
                    </Button>
                  </div>
                </div>{" "}
                {i.link && (
                  <Link
                    href={i.link}
                    className="my-3 font-bold hover:text-red-400"
                  >
                    LINK
                  </Link>
                )}
                {expanded[i.id] && (
                  <div className="m-2 p-2">
                    <CommentList postId={i.id} comments={i.comments} />
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-red-400">No intel available.</div>
        )}

        <div className="mt-8 text-center text-sm text-red-400">
          Browse responsibly CHOOMS! Leaking to corp channels will get you
          ZEROED you GONK.
        </div>
      </div>
    </div>
  );
}
