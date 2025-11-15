"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import CommentBox from "./commentBox";

export default function MoreComments({ postID }: { postID: string }) {
  const { data: session } = useSession();

  // local cursors
  const [cursor, setCursor] = useState<string | null>(null); // NEXT page
  const [reverseCursor, setReverseCursor] = useState<string | null>(null); // PREV page

  const { data, status } = api.post.list_comments_By_Post.useQuery(
    {
      postID,
      limit: 50,
      cursor,
      reverseCursor,
    },
    {
      placeholderData: (prev) => prev,
    },
  );

  if (status === "pending") {
    return <div className="p-4 text-red-500">LOADING TRANSMISSIONS…</div>;
  }
  if (status === "error") {
    return (
      <div className="border border-red-900 p-4 text-red-600">
        SIGNAL JAMMED — FAILED TO RETRIEVE COMMENTS
      </div>
    );
  }

  // if (!data || data.items.length === 0) {
  //   return (
  //     <div className="space-y-4">
  //       <p className="border border-red-800 p-2 italic text-red-700">
  //         NO SIGNALS…
  //       </p>
  //       {session && <CommentBox postID={postID} />}
  //     </div>
  //   );
  // }

  const { items, nextCursor, prevCursor } = data;
  // If backend returned an empty page, do NOT break the UI.
  // Stay on the current page and do NOT clear buttons.
  if (items.length === 0) {
    return (
      <div className="mt-6 space-y-4">
        <p className="text-red-500">NO MORE COMMENTS IN THIS DIRECTION…</p>
        <div className="flex justify-between p-2">
          <button
            disabled={!prevCursor}
            onClick={() => {
              setCursor(null);
              setReverseCursor(prevCursor);
            }}
            className="border border-red-700 bg-black px-4 py-2 text-red-400 hover:bg-red-950 disabled:opacity-30"
          >
            ← PREVIOUS
          </button>

          <button
            disabled={!nextCursor}
            onClick={() => {
              setReverseCursor(null);
              setCursor(nextCursor);
            }}
            className="border border-red-700 bg-black px-4 py-2 text-red-400 hover:bg-red-950 disabled:opacity-30"
          >
            NEXT →
          </button>
        </div>
        {session && <CommentBox postId={postID} />}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {items.map((comment) => (
        <div
          key={comment.id}
          className="rounded-lg border border-red-800 bg-gray-900 p-3"
        >
          <div className="text-sm text-red-400">
            <strong>{comment.poster ?? "Anonymous"}</strong>{" "}
            <span className="text-xs text-red-700">
              [{new Date(comment.createdAt).toLocaleString()}]
            </span>
          </div>

          <p className="mt-2 whitespace-normal break-all text-red-300">
            {comment.content}
          </p>

          {session?.user?.username === comment.poster && (
            <p className="mt-1 text-xs italic text-red-700">
              Your transmission :)
            </p>
          )}
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-between p-2">
        <button
          disabled={!prevCursor}
          onClick={() => {
            setCursor(null);
            setReverseCursor(prevCursor);
          }}
          className="border border-red-700 bg-black px-4 py-2 text-red-400 hover:bg-red-950 disabled:opacity-30"
        >
          ← PREVIOUS
        </button>

        <button
          disabled={!nextCursor}
          onClick={() => {
            setReverseCursor(null);
            setCursor(nextCursor);
          }}
          className="border border-red-700 bg-black px-4 py-2 text-red-400 hover:bg-red-950 disabled:opacity-30"
        >
          NEXT →
        </button>
      </div>

      {session && <CommentBox postId={postID} />}
    </div>
  );
}
