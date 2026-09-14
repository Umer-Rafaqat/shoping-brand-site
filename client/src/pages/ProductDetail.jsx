import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/product-detail/Breadcrumb";
import ThumbnailColumn from "@/components/product-detail/ThumbnailColumn";
import MainImage from "@/components/product-detail/MainImage";
import ProductInfo from "@/components/product-detail/ProductInfo";
import ProductTabs from "@/components/product-detail/ProductTabs";
import ReviewsSection from "@/components/product-detail/ReviewsSection";
import RelatedProducts from "@/components/product-detail/RelatedProducts";
import { getPublicProductByIdAPI } from "@/api/publicProducts.api";
import { assetUrl } from "@/lib/assetUrl";

const CONTAINER = "mx-auto max-w-[1240px] px-4 lg:px-0";

const mapProduct = (p) => ({
  id: p._id,
  name: p.name,
  rating: p.rating || 0,
  price: p.price,
  oldPrice: p.oldPrice,
  discount: p.discountPercent ? `-${p.discountPercent}%` : null,
  description: p.description,
  images: p.images?.length ? p.images.map(assetUrl) : [],
  colors: p.colors || [],
  sizes: p.sizes || [],
  stock: p.stock,
  category: p.category?.name || "",
});

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("Rating & Reviews");

  useEffect(() => {
    setLoading(true);
    setError("");
    getPublicProductByIdAPI(id)
      .then((p) => {
        setProduct(mapProduct(p));
        setActiveImage(0);
      })
      .catch(() => setError("This product couldn't be found."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="w-full overflow-x-hidden">
        <AnnouncementBar />
        <Navbar />
        <div className={`${CONTAINER} py-20 text-center text-sm text-black/50`}>
          Loading product...
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full overflow-x-hidden">
        <AnnouncementBar />
        <Navbar />
        <div
          className={`${CONTAINER} flex flex-col items-center gap-4 py-20 text-center`}
        >
          <p className="text-sm text-black/50">{error}</p>
          <Link to="/" className="text-sm font-medium underline">
            Back to home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <div className={CONTAINER}>
        <Breadcrumb
          items={["Home", "Shop", product.category, product.name].filter(
            Boolean,
          )}
        />

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[175px_auto_530px] lg:items-start lg:gap-10">
          {/* Mobile: Main Image pehle */}
          <div className="order-1 lg:order-2">
            <MainImage src={product.images[activeImage]} alt={product.name} />
          </div>

          {/* Mobile: Thumbnails baad mein */}
          <div className="order-2 lg:order-1">
            <ThumbnailColumn
              images={product.images}
              activeIndex={activeImage}
              onSelect={setActiveImage}
            />
          </div>

          {/* Product Info */}
          <div className="order-3">
            <ProductInfo product={product} />
          </div>
        </div>

        <ProductTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Reviews and related products are still sample/demo data for now */}
        {activeTab === "Rating & Reviews" && <ReviewsSection />}
        {activeTab === "Product Details" && (
          <p className="mt-8 max-w-2xl font-satoshi text-sm leading-relaxed text-black/60">
            {product.description}
          </p>
        )}
        {activeTab === "FAQs" && (
          <p className="mt-8 font-satoshi text-sm text-black/60">
            No FAQs have been added for this product yet.
          </p>
        )}

        <RelatedProducts />
      </div>

      <div className="-mb-20 relative z-10 mt-16">
        <Newsletter />
      </div>

      <Footer />
    </div>
  );
}
