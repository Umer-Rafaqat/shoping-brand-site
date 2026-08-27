import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import {
  getPublicCategoriesAPI,
  getPublicProductsAPI,
} from "@/api/publicProducts.api";

const CONTAINER = "mx-auto max-w-[1240px] px-4 lg:px-0";
const PAGE_SIZE = 9;

const DEFAULT_FILTERS = {
  priceRange: [0, 1000],
  selectedColors: [],
  selectedSizes: [],
};

const SORT_API_VALUES = {
  "Most Popular": "topSelling",
  Newest: "newest",
  "Price: Low to High": "priceAsc",
  "Price: High to Low": "priceDesc",
};

const mapProduct = (p) => ({
  id: p._id,
  name: p.name,
  image: p.images?.[0] || "",
  rating: p.rating || 0,
  price: p.price,
  oldPrice: p.oldPrice,
  discount: p.discountPercent ? `-${p.discountPercent}%` : null,
});

export default function Category() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sort, setSort] = useState("Most Popular");
  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const activeCategory = categories.find((category) => category.slug === slug);

  useEffect(() => {
    getPublicCategoriesAPI()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    document.body.style.overflow = isFiltersOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFiltersOpen]);

  useEffect(() => {
    setLoading(true);
    const [minPrice, maxPrice] = appliedFilters.priceRange;

    getPublicProductsAPI({
      page: currentPage,
      limit: PAGE_SIZE,
      category: activeCategory?.slug,
      minPrice,
      maxPrice,
      colors: appliedFilters.selectedColors,
      sizes: appliedFilters.selectedSizes,
      sort: SORT_API_VALUES[sort],
    })
      .then((data) => {
        setProducts(data.products.map(mapProduct));
        setTotal(data.total);
        setTotalPages(Math.max(1, data.totalPages));
      })
      .catch(() => {
        setProducts([]);
        setTotal(0);
        setTotalPages(1);
      })
      .finally(() => setLoading(false));
  }, [currentPage, appliedFilters, activeCategory?.slug, sort]);

  useEffect(() => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setCurrentPage(1);
  }, [slug]);

  const pageStart = (currentPage - 1) * PAGE_SIZE;

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
        <Breadcrumb items={["Home", slug || "Category"]} />

        <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-start">
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
            categories={categories}
            activeCategorySlug={activeCategory?.slug}
            onCategoryChange={(categorySlug) => {
              navigate(`/category/${categorySlug}`);
              setIsFiltersOpen(false);
            }}
          />

          <div className="flex-1">
            <CategoryHeader
              title={activeCategory?.name || "Casual"}
              showingFrom={total === 0 ? 0 : pageStart + 1}
              showingTo={Math.min(pageStart + PAGE_SIZE, total)}
              total={total}
              onOpenFilters={() => setIsFiltersOpen(true)}
              sort={sort}
              onSortChange={(value) => {
                setSort(value);
                setCurrentPage(1);
              }}
            />

            <SelectedFilters
              filters={appliedFilters}
              onChange={(f) => {
                setFilters(f);
                setAppliedFilters(f);
              }}
            />

            {loading ? (
              <p className="mt-16 text-center font-satoshi text-sm text-black/50">
                Loading...
              </p>
            ) : products.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <p className="mt-16 text-center font-satoshi text-sm text-black/50">
                No products match the selected filters.
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
