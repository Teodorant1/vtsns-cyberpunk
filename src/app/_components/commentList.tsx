// "use client";

// import { api } from "~/trpc/react";
// import { useSession } from "next-auth/react";

// interface CommentListProps {
//   articleId?: string;
// }

// export default function CommentList({ articleId }: CommentListProps) {
//   const { data: session } = useSession();
// //   const { data: comments, isLoading } = api.comment.getAll.useQuery({
// //     articleId,
// //   });

//   if (isLoading)
//     return <p className="text-red-500">LOADING TRANSMISSIONS...</p>;

//   if (!comments || comments.length === 0)
//     return <p className="italic text-red-700">NO SIGNALS DETECTED...</p>;

//   return (
//     <div className="mt-6 space-y-4">
//       {comments.map((comment) => (
//         <div
//           key={comment.id}
//           className="rounded-lg border border-red-800 bg-gray-900 p-3"
//         >
//           <div className="text-sm text-red-400">
//             <strong>{comment.user?.username ?? "Anonymous"}</strong>{" "}
//             <span className="text-xs text-red-700">
//               [{new Date(comment.createdAt).toLocaleString()}]
//             </span>
//           </div>
//           <p className="mt-2 text-red-300">{comment.content}</p>
//           {session?.user?.id === comment.userId && (
//             <p className="mt-1 text-xs italic text-red-700">
//               (Your transmission)
//             </p>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
