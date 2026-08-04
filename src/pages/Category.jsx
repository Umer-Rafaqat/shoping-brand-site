import { useEffect, useMemo, useState } from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/product-detail/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import FiltersSidebar from "@/components/category/FiltersSidebar";
import CategoryHeader from "@/components/category/CategoryHeader";
import SelectedFilters from "@/components/category/SelectedFilters";
import { categoryProducts } from "@/data/categoryProducts";

const CONTAINER = "mx-auto max-w-[1240px] px-4 lg:px-0";
const PAGE_SIZE = 9;

const DEFAULT_FILTERS = {
  priceRange: [50, 200],
  selectedColors: [],
  selectedSizes: ["Large"],
  selectedDressStyles: [],
};

export default function Category() {
  // Draft filters reflect what's on the sidebar right now; appliedFilters
  // is what actually filters the grid, and only updates on "Apply Filter"

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Lock background scroll while the mobile filter drawer is open.
  useEffect(() => {
    document.body.style.overflow = isFiltersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFiltersOpen]);

  const filteredProducts = useMemo(() => {
    const [min, max] = appliedFilters.priceRange;
    return categoryProducts.filter((p) => p.price >= min && p.price <= max);
  }, [appliedFilters]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE),
  );
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageProducts = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE);

  const handleApply = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    setIsFiltersOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <div className={CONTAINER}>
        <Breadcrumb items={["Home", "Casual"]} />

        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Backdrop for the mobile filter drawer */}
          {isFiltersOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
              onClick={() => setIsFiltersOpen(false)}
            />
          )}

          <FiltersSidebar
            filters={filters}
            onChange={setFilters}
            onApply={handleApply}
            isOpen={isFiltersOpen}
            onClose={() => setIsFiltersOpen(false)}
          />

          <div className="flex-1">
            <CategoryHeader
              title="Casual"
              showingFrom={filteredProducts.length === 0 ? 0 : pageStart + 1}
              showingTo={Math.min(
                pageStart + PAGE_SIZE,
                filteredProducts.length,
              )}
              total={filteredProducts.length}
              onOpenFilters={() => setIsFiltersOpen(true)}
            />

            <SelectedFilters
              filters={appliedFilters}
              onChange={(f) => {
                setFilters(f);
                setAppliedFilters(f);
              }}
            />

            {pageProducts.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {pageProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <p className="mt-16 text-center font-satoshi text-sm text-black/50">
                No products match the selected price range.
              </p>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      <div className="-mb-20 relative z-10">
        <Newsletter />
      </div>
      <Footer />
    </div>
  );
}
