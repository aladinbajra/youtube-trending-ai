import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, pageSize, totalItems, onPageChange }: PaginationProps) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      {/* Info */}
      <div className="text-sm text-text-body">
        Showing <span className="font-semibold text-text-heading">{startItem}</span> to{' '}
        <span className="font-semibold text-text-heading">{endItem}</span> of{' '}
        <span className="font-semibold text-text-heading">{totalItems}</span> results
      </div>

      {/* Page Numbers */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-button border border-zinc-800 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Previous page"
          data-testid="prev-page"
        >
          <ChevronLeft size={20} />
        </button>

        {getPageNumbers().map((page, index) => (
          typeof page === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`px-4 py-2 rounded-button border transition-all ${
                currentPage === page
                  ? 'bg-youtube border-primary text-white shadow-glow'
                  : 'border-zinc-800 hover:border-primary'
              }`}
              data-testid={`page-${page}`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-2 text-text-body">
              {page}
            </span>
          )
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-button border border-zinc-800 hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Next page"
          data-testid="next-page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

