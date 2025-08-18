import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (currentPage > 3) pages.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (currentPage < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className={`${totalPages===0&& "hidden"} flex justify-center items-center mt-6`}>
      <div className="join">
        <button
          className="join-item rounded-none border-none btn btn-md disabled:hidden bg-white hover:text-[#C19A6B]"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </button>

        {pages.map((page, idx) =>
          page === "..." ? (
            <button key={idx} className="join-item border-none bg-white btn btn-md btn-disabled">
              ...
            </button>
          ) : (
            <button
              key={idx}
              className={`join-item btn btn-md border-none bg-white hover:text-[#C19A6B] ${
                currentPage === page ? "text-[#C19A6B]" : ""
              }`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )
        )}

        <button
          className="join-item rounded-none border-none btn btn-md disabled:hidden bg-white hover:text-[#C19A6B]"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;
