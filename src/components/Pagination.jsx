import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Builds a page list like [1, 2, 3, "...", 8, 9, 10] — always shows the
// first/last 3 pages and collapses the middle once there's a gap.
function getPageList(current, total) {
  const pages = [];
  const windowSize = 1;

  const start = Math.max(1, current - windowSize);
  const end = Math.min(total, current + windowSize);

  const showLeftEllipsis = start > 2;
  const showRightEllipsis = end < total - 1;

  pages.push(1);
  if (showLeftEllipsis) pages.push("ellipsis-left");
  for (let i = Math.max(2, start); i <= Math.min(total - 1, end); i++) {
    pages.push(i);
  }
  if (showRightEllipsis) pages.push("ellipsis-right");
  if (total > 1) pages.push(total);

  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = getPageList(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="mt-9 flex flex-wrap items-center justify-between gap-3"
    >
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} />
        Previous
      </Button>

      <div className="flex items-center gap-1.5">
        {pages.map((page, i) =>
          typeof page === "number" ? (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={page === currentPage ? "page" : undefined}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full font-satoshi text-sm transition-colors",
                page === currentPage
                  ? "bg-surface-100 font-medium text-black"
                  : "text-black/50 hover:bg-surface-100"
              )}
            >
              {page}
            </button>
          ) : (
            <span
              key={page + i}
              className="flex h-10 w-6 items-center justify-center text-black/40"
            >
              ...
            </span>
          )
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
        <ChevronRight size={16} />
      </Button>
    </nav>
  );
}