// "use client";
// import React from "react";
// import { type HrefLinksProps } from "~/project-types";
// import { type article } from "~/server/db/schema";

// const HrefLinks: React.FC<typeof article> = (article) => {
//   function getHrefs() {
//     const hrefs: string[] = article.hrefs;
//     return hrefs;
//   }

//   return (
//     <div className="href-links-container rounded-lg bg-gray-900 p-4 text-red-500 shadow-lg">
//       <h3 className="mb-4 text-xl font-bold text-white">Related Links</h3>
//       <ul className="space-y-2">
//         {hrefs.map((href, index) => (
//           <li key={index} className="group">
//             <a
//               href={href}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-red-500 transition-all duration-300 hover:text-red-300 group-hover:underline"
//             >
//               {href}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default HrefLinks;
