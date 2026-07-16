'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  // Logic to generate page numbers with '...'
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  // Base styles for all pagination items to keep them strictly 32x32 with 8px radius
  const baseItemStyles = "flex items-center justify-center w-[32px] h-[32px] rounded-[8px] text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30";
  
  // Styles for clickable inactive buttons
  const inactiveButtonStyles = "bg-background border border-border text-foreground hover:bg-muted/50 dark:bg-card dark:border-border dark:text-foreground dark:hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <nav aria-label="Pagination Navigation" className="flex items-center gap-[10px]" dir="ltr">
      {/* First Page (<<) */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="Go to first page"
        className={`${baseItemStyles} ${inactiveButtonStyles}`}
      >
        <ChevronsLeft className="w-4 h-4 rtl:hidden" />
        <ChevronsRight className="w-4 h-4 hidden rtl:block" />
      </button>

      {/* Previous Page (<) */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
        className={`${baseItemStyles} ${inactiveButtonStyles}`}
      >
        <ChevronLeft className="w-4 h-4 rtl:hidden" />
        <ChevronRight className="w-4 h-4 hidden rtl:block" />
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => {
        if (page === '...') {
          return (
            <div key={`ellipsis-${index}`} className={`${baseItemStyles} text-muted-foreground bg-transparent`}>
              <MoreHorizontal className="w-4 h-4" />
            </div>
          );
        }

        const isCurrentPage = page === currentPage;

        return (
          <button
            key={`page-${page}`}
            onClick={() => onPageChange(page as number)}
            aria-current={isCurrentPage ? 'page' : undefined}
            className={`
              ${baseItemStyles}
              ${isCurrentPage 
                ? 'bg-primary text-white dark:text-zinc-900 border-transparent' 
                : inactiveButtonStyles}
            `}
          >
            {page}
          </button>
        );
      })}

      {/* Next Page (>) */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
        className={`${baseItemStyles} ${inactiveButtonStyles}`}
      >
        <ChevronRight className="w-4 h-4 rtl:hidden" />
        <ChevronLeft className="w-4 h-4 hidden rtl:block" />
      </button>

      {/* Last Page (>>) */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Go to last page"
        className={`${baseItemStyles} ${inactiveButtonStyles}`}
      >
        <ChevronsRight className="w-4 h-4 rtl:hidden" />
        <ChevronsLeft className="w-4 h-4 hidden rtl:block" />
      </button>
    </nav>
  );
};