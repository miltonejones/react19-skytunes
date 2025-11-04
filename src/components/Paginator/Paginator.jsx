import React from "react";

const Paginator = ({
  count,
  currentPage,
  onPageClick,
  itemsPerPage = 100,
  maxVisiblePages = 5,
}) => {
  const totalPages = Math.max(
    1,
    Math.ceil(Number(count) / Number(itemsPerPage || 1))
  );
  if (totalPages <= 1) return null;

  // Coerce and clamp first
  const mvp = Math.max(1, Number(maxVisiblePages) || 5);
  const cp = Math.min(Math.max(1, Number(currentPage) || 1), totalPages);

  const getVisiblePages = () => {
    // If total pages fewer than window, just show all
    if (totalPages <= mvp) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(mvp / 2);

    // Tentative window start centered around current page
    let start = cp - half;

    // If mvp is even, bias the window to include more pages after current
    // so that current is within the window [start, start + mvp - 1]
    if (mvp % 2 === 0) {
      start = cp - (half - 1);
    }

    // Clamp start to [1, maxStart]
    const maxStart = totalPages - mvp + 1;
    start = Math.max(1, Math.min(start, maxStart));

    const end = Math.min(totalPages, start + mvp - 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageClick(page);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      {/* Previous */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
        }`}
      >
        Previous
      </button>

      {/* First Page */}
      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => handlePageClick(1)}
            className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="px-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            page === currentPage
              ? "bg-blue-600 text-white border border-blue-600"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last Page */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => handlePageClick(totalPages)}
            className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Paginator;
