"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { type postComments_type } from "~/server/db/schema";
import CommentBox from "./commentBox";
import MoreComments from "./MoreComments"; // <-- you will create this identical to article version

interface CommentListProps {
  postId?: string;
  comments?: postComments_type[];
}

export default function PostCommentList({
  postId,
  comments,
}: CommentListProps) {
  const { data: session } = useSession();
  const [showAll, setShowAll] = useState(false);

  // --------------------------
  // FULL LOG PAGE
  // --------------------------
  if (showAll && postId) {
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
        <MoreComments postID={postId} />
      </div>
    );
  }

  // --------------------------
  // NO COMMENTS
  // --------------------------
  return !comments || comments.length === 0 ? (
    <div className="space-y-4">
      <p className="border border-red-800 p-2 italic text-red-700">
        NO SIGNALS DETECTED...
      </p>
      {session && <CommentBox postId={postId} />}
    </div>
  ) : (
    // --------------------------
    // LATEST 50 COMMENTS
    // --------------------------
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

          {session?.user?.username === comment.poster && (
            <p className="mt-1 text-xs italic text-red-700">
              Your transmission :)
            </p>
          )}
        </div>
      ))}

      {session && <CommentBox postId={postId} />}
    </div>
  );
}
