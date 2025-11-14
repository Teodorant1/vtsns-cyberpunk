"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import MoreComments from "./MoreComments";
import { type articleComments_type } from "~/server/db/schema";
import CommentBox from "./commentBox";

interface CommentListProps {
  articleId?: string;
  comments?: articleComments_type[];
}

export default function CommentList({ articleId, comments }: CommentListProps) {
  const { data: session } = useSession();
  const [showAll, setShowAll] = useState(false);

  if (showAll && articleId) {
    return (
      <div className="mt-6 space-y-4">
        <div className="m-2 flex items-center justify-between p-2">
          <span>FULL COMMENT LOG</span>
          <button
            className="border border-red-700 px-3 py-1 text-red-400 hover:bg-red-900"
            onClick={() => setShowAll(false)}
          >
            BACK TO LATEST 50
          </button>
        </div>

        <MoreComments articleId={articleId} />
      </div>
    );
  }

  return !comments || comments.length === 0 ? (
    <div className="space-y-4">
      <p className="border border-red-800 p-2 italic text-red-700">
        NO SIGNALS DETECTED...
      </p>
      {session && <CommentBox articleId={articleId} />}
    </div>
  ) : (
    <div className="mt-6 space-y-4">
      <div className="m-2 flex items-center justify-between p-2">
        <span>THE LATEST 50 COMMENTS</span>
        <button
          className="border border-red-700 px-3 py-1 text-red-400 hover:bg-red-900"
          onClick={() => setShowAll(true)}
        >
          VIEW FULL LOG
        </button>
      </div>

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
        </div>
      ))}

      {session && <CommentBox articleId={articleId} />}
    </div>
  );
}
