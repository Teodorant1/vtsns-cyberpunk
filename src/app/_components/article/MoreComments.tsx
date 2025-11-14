"use client";

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import CommentBox from "./commentBox";

export default function MoreComments({ articleId }: { articleId: string }) {
  const { data: session } = useSession();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    api.post.listByArticle.useInfiniteQuery(
      {
        articleId,
        limit: 50,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  if (status === "pending") {
    return (
      <div className="p-4 text-red-500">LOADING ADDITIONAL TRANSMISSIONS…</div>
    );
  }
  if (status === "error") {
    return (
      <div className="border border-red-900 p-4 text-red-600">
        SIGNAL JAMMED — FAILED TO RETRIEVE COMMENTS
      </div>
    );
  }

  if (!data || data.pages.length === 0) {
    return (
      <div className="space-y-4">
        <p className="border border-red-800 p-2 italic text-red-700">
          NO MORE SIGNALS…
        </p>
        {session && <CommentBox articleId={articleId} />}
      </div>
    );
  }

  const comments = data.pages.flatMap((page) => page.items);

  return (
    <div className="mt-6 space-y-4">
      <div className="m-2 p-2">FULL COMMENT LOG (PAGINATED)</div>

      {comments.map((comment) => (
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

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="border border-red-700 bg-black px-4 py-2 text-red-400 hover:bg-red-950"
        >
          {isFetchingNextPage ? "RETRIEVING..." : "LOAD MORE SIGNALS"}
        </button>
      )}

      {session && <CommentBox articleId={articleId} />}
    </div>
  );
}
