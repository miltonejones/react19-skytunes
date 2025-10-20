import React from "react";

const Paginator = ({
  count,
  currentPage,
  onPageClick,
  itemsPerPage = 100,
  maxVisiblePages = 5,
}) => {
  const totalPages = Math.ceil(count / itemsPerPage);

  // Don't render if there's only one page or no items
  if (totalPages <= 1) return null;

  // Calculate visible page range
  const getVisiblePages = () => {
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      startPage = 1;
      endPage = totalPages;
    } else {
      // Calculate start and end pages to show current page in middle
      const halfVisible = Math.floor(maxVisiblePages / 2);

      if (currentPage <= halfVisible) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + halfVisible >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfVisible;
        endPage = currentPage + halfVisible;
      }
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageClick(page);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      {/* Previous Button */}
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

      {/* First Page + Ellipsis */}
      {visiblePages[0] > 1 && (
        <>
          <button
            onClick={() => handlePageClick(1)}
            className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          >
            1
          </button>
          {visiblePages[0] > 2 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            page === Number(currentPage)
              ? "bg-blue-600 text-white border border-blue-600"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Last Page + Ellipsis */}
      {visiblePages[visiblePages.length - 1] < totalPages && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
            <span className="px-2 py-2 text-gray-500">...</span>
          )}
          <button
            onClick={() => handlePageClick(totalPages)}
            className="px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next Button */}
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
