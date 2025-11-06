"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";

interface CommentBoxProps {
  articleId?: string; // optional if you later add article-specific comments
}

export default function CommentBox({ articleId }: CommentBoxProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  //   const postComment = api.comment.create.useMutation({
  //     onSuccess: () => {
  //       setContent("");
  //       setSuccess(true);
  //       setTimeout(() => setSuccess(false), 2000);
  //     },
  //     onError: (err) => {
  //       setError(err.message);
  //     },
  //   });

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (!content.trim()) return setError("EMPTY TRANSMISSION DETECTED");
  //     postComment.mutate({ content, articleId });
  //   };

  return (
    <form
      //   onSubmit={handleSubmit}
      className="rounded-lg border border-red-800 bg-gray-900 p-4 shadow-lg"
    >
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
          type="submit"
          className="border-red-800 bg-gray-800 text-red-500 hover:bg-gray-700"
        >
          TRANSMIT
        </Button>
      </div>
    </form>
  );
}
