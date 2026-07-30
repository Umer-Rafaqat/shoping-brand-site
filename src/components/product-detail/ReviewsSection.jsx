import { useState } from "react";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReviewCard from "@/components/product-detail/ReviewCard";
import { reviews } from "@/data/reviews";

const INITIAL_COUNT = 4;

export default function ReviewsSection() {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between gap-3">
  <h2 className="font-integral text-lg font-bold sm:text-2xl">
    All Reviews <span className="text-black/40">(451)</span>
  </h2>

  <div className="flex items-center gap-2 sm:gap-3">
    {/* Filter */}
    <button
      type="button"
      aria-label="Filter reviews"
      className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-100 sm:h-11 sm:w-11"
    >
      <SlidersHorizontal size={16} />
    </button>

    {/* Mobile */}
    <Button size="sm" className="sm:hidden">
      Write a Review
    </Button>

    {/* Desktop */}
    <button
      type="button"
      className="hidden sm:flex h-11 items-center gap-2 rounded-full bg-surface-100 px-4 font-satoshi text-sm"
    >
      Latest
      <ChevronDown size={14} />
    </button>

    <Button size="sm" className="hidden sm:inline-flex">
      Write a Review
    </Button>
  </div>
</div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {visibleReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-9 flex justify-center">
          <Button
            variant="outline"
            className="px-10"
            onClick={() => setVisibleCount((c) => c + 2)}
          >
            Load More Reviews
          </Button>
        </div>
      )}
    </div>
  );
}
