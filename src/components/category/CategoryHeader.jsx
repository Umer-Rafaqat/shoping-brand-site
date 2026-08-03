import { useState } from "react";
import { ChevronDown, SlidersVertical, Check } from "lucide-react";

const SORT_OPTIONS = [
  "Most Popular",
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
];

export default function CategoryHeader({
  title,
  showingFrom,
  showingTo,
  total,
  onOpenFilters,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0]);

  const countText = `Showing ${showingFrom}-${showingTo} of ${total} Products`;

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h1 className="font-integral text-2xl font-bold sm:text-3xl">{title}</h1>
        <span className="font-satoshi text-xs text-black/50 lg:hidden">
          {countText}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          aria-label="Open filters"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-100 lg:hidden"
        >
          <SlidersVertical size={16} />
        </button>

        <div className="hidden items-center gap-3 lg:flex">
          <span className="font-satoshi text-sm text-black/50">{countText}</span>
          <span className="text-black/20">|</span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setSortOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
              className="flex items-center gap-1 font-satoshi text-sm text-black"
            >
              Sort by: <span className="font-medium">{selectedSort}</span>
              <ChevronDown
                size={14}
                className={sortOpen ? "rotate-180 transition-transform" : "transition-transform"}
              />
            </button>

            {sortOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
                <ul
                  role="listbox"
                  className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-2xl border border-black/10 bg-white py-1 shadow-lg"
                >
                  {SORT_OPTIONS.map((option) => (
                    <li key={option}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={option === selectedSort}
                        onClick={() => {
                          setSelectedSort(option);
                          setSortOpen(false);
                        }}
                        className="flex w-full items-center justify-between px-4 py-2.5 text-left font-satoshi text-sm text-black/70 hover:bg-surface-100 hover:text-black"
                      >
                        {option}
                        {option === selectedSort && <Check size={14} />}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}