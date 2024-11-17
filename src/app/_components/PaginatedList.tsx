import { useState } from "react";
import { Button } from "~/components/ui/button";
import { type PaginatedListProps } from "~/project-types";

const PaginatedList: React.FC<PaginatedListProps> = ({
  categories,
  currentCategory,
  onToggleCategory,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  // Dynamic Pagination Logic
  const getPageNumbers = () => {
    const maxVisiblePages = 10;
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is within the max visible range
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      // Determine start and end range for visible pages
      const start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const end = Math.min(totalPages - 2, start + maxVisiblePages - 1);

      // Handle cases where current page is near the start or end
      if (start > 1) pages.push("...");
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (end < totalPages - 2) pages.push("...");

      // Always show last page
      pages.push(totalPages - 1);
    }

    return pages;
  };

  const startIdx = currentPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = categories.slice(startIdx, endIdx);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageClick = (pageIndex: number) => {
    setCurrentPage(pageIndex);
  };

  return (
    <div className="mb-6 flex flex-col gap-3">
      {/* Pagination Info */}
      <div>
        {/* <div>
          Subjects: {categories.length}, Total Pages: {totalPages}, Current
          Page: {currentPage + 1}
        </div> */}
        <button
          className="m-2 p-2 outline outline-red-400"
          onClick={handlePrevious}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <button
          className="m-2 p-2 outline outline-red-400"
          onClick={handleNext}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </button>
      </div>

      {/* Page Numbers */}
      <div className="flex flex-wrap gap-2">
        {getPageNumbers().map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => handlePageClick(page)}
              className={`rounded px-3 py-1 ${
                page === currentPage
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {page + 1}
            </button>
          ) : (
            <span key={index} className="px-3 py-1 text-gray-500">
              ...
            </span>
          ),
        )}
      </div>

      {/* Category Items */}
      <div className="flex flex-wrap gap-3">
        {currentItems.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => onToggleCategory(cat.name)}
            className={`button-hover mx-2 my-1 ${
              currentCategory === cat.name ? "bg-red-600" : "bg-gray-800"
            } w-64 justify-start truncate text-white hover:bg-red-700`}
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PaginatedList;
