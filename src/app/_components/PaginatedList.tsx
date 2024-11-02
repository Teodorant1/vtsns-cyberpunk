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

  const startIdx = currentPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentItems = categories.slice(startIdx, endIdx);

  const handleNext = () => {
    if (endIdx < categories.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (startIdx > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="mb-6 flex flex-wrap gap-3">
      <div>
        <div>
          Subjects : {categories.length} , Number of pages:{" "}
          {Math.ceil(categories.length / 10)} , Current Page: {currentPage + 1}
        </div>
        <button
          className="m-5"
          onClick={handlePrevious}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <button
          className="m-5"
          onClick={handleNext}
          disabled={endIdx >= categories.length}
        >
          Next
        </button>
      </div>
      <div>
        {" "}
        {currentItems.map((cat) => (
          <Button
            key={cat.id}
            onClick={() => onToggleCategory(cat.name)}
            className={`button-hover mx-2 my-1 ${
              currentCategory === cat.name ? "bg-red-600" : "bg-gray-800"
            } truncate text-white hover:bg-red-700`}
          >
            {cat.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PaginatedList;
