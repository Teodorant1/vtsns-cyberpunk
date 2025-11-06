"use client";

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { type articleComments_type } from "~/server/db/schema";

interface CommentListProps {
  articleId?: string;
  comments?: articleComments_type[];
}

export default function CommentList({ articleId, comments }: CommentListProps) {
  const { data: session } = useSession();

  if (!comments)
    return <p className="text-red-500">LOADING TRANSMISSIONS...</p>;

  if (!comments || comments.length === 0)
    return <p className="italic text-red-700">NO SIGNALS DETECTED...</p>;

  return (
    <div className="mt-6 space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-lg border border-red-800 bg-gray-900 p-3"
        >
          <div className="text-sm text-red-400">
            <strong>{comment.user?.username ?? "Anonymous"}</strong>{" "}
            <span className="text-xs text-red-700">
              [{new Date(comment.createdAt).toLocaleString()}]
            </span>
          </div>
          <p className="mt-2 text-red-300">{comment.content}</p>
          {session?.user?.id === comment.userId && (
            <p className="mt-1 text-xs italic text-red-700">
              (Your transmission)
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
