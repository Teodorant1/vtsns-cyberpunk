"use client";
import React from "react";
import { type HrefLinksProps } from "~/project-types";
import Link from "next/link";

const HrefLinks: React.FC<HrefLinksProps> = ({ href_links }) => {
  return (
    <div className="href-links-container rounded-lg bg-gray-900 p-4 text-red-500 shadow-lg">
      <h3 className="mb-4 text-xl font-bold text-white">Related Links</h3>
      <ul className="space-y-2">
        {href_links.map((href, index) => (
          <li key={index} className="group">
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-500 transition-all duration-300 hover:text-red-300 group-hover:underline"
            >
              {href}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HrefLinks;
