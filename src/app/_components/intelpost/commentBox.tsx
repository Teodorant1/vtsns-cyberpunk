"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import ErrorPopup from "~/components/ui/error-popup";
import { set } from "date-fns";
interface CommentBoxProps {
  postId?: string; // optional if you later add article-specific comments
}

export default function CommentBox({ postId }: CommentBoxProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [success, setSuccess] = useState(false);
  const trpc = api.useUtils();

  const postComment = api.post.create_comment_post.useMutation({
    onSuccess: async (e) => {
      setContent("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      setIsLoading(false);
      await trpc.intel.getLatestIntel.invalidate();

      if (e.error) {
        console.error("Error posting comment:", e.errorText);
        setErrorText(e.errorText ?? "TRANSMISSION FAILED");
        setError(true);
      }
    },
    onError: (err) => {
      console.error("Error posting comment: ", err);
      setErrorText(err.message);
      setError(true);
      setIsLoading(false);
    },
  });

  function handle_postComment() {
    if (!content.trim()) {
      setErrorText("EMPTY TRANSMISSION DETECTED");
      setError(true);
      setIsLoading(false);
      return;
    }
    postComment.mutate({ postId: postId ?? "", commentContent: content });
  }

  return (
    <div
      //   onSubmit={handleSubmit}
      className="rounded-lg border border-red-800 bg-gray-900 p-4 shadow-lg"
    >
      <ErrorPopup
        visible={error}
        message={errorText}
        onClose={() => setError(false)}
        timeout={15000}
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Leave your encrypted transmission here..."
        className="w-full resize-none rounded bg-gray-800 p-2 text-red-400 placeholder-red-700 focus:outline-none"
        rows={3}
      />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      {success && (
        <p className="mt-2 text-sm text-green-500">TRANSMISSION SENT</p>
      )}
      <div className="mt-3 flex justify-end">
        <Button
          onClick={() => {
            handle_postComment();
          }}
          className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
        >
          TRANSMIT
        </Button>
      </div>
    </div>
  );
}
