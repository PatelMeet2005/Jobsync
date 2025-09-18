import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Calculate page numbers to show (with ellipsis for many pages)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always include first page
      pages.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 3) {
        endPage = 4;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('ellipsis-left');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-right');
      }
      
      // Always include last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <nav className="pagination-container" aria-label="Pagination">
      <button
        className="pagination-btn pagination-prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        tabIndex={0}
        aria-label="Previous page"
      >
        <i className="fas fa-chevron-left"></i>
        <span>Previous</span>
      </button>
      
      <div className="pagination-pages">
        {getPageNumbers().map((page, index) => {
          if (page === 'ellipsis-left' || page === 'ellipsis-right') {
            return (
              <span key={index} className="pagination-ellipsis">
                <i className="fas fa-ellipsis-h"></i>
              </span>
            );
          }
          
          return (
            <button
              key={index}
              className={`pagination-btn pagination-page ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
              tabIndex={0}
              aria-label={currentPage === page ? `Current Page, Page ${page}` : `Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : null}
            >
              {page}
            </button>
          );
        })}
      </div>
      
      <button
        className="pagination-btn pagination-next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        tabIndex={0}
        aria-label="Next page"
      >
        <span>Next</span>
        <i className="fas fa-chevron-right"></i>
      </button>
    </nav>
  );
};

export default Pagination;