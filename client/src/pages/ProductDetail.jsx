import { useState } from "react";
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
import { productDetail } from "@/data/productDetail";

// Container used throughout this page per spec: 1240px, centered,
// ~100px desktop horizontal breathing room via px-4 → lg:px-0 (the
// max-w cap itself provides the ~100px gutter on wider screens).
const CONTAINER = "mx-auto max-w-[1240px] px-4 lg:px-0";

export default function ProductDetail() {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("Rating & Reviews");

  return (
    <div className="w-full overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />

      <div className={CONTAINER}>
        <Breadcrumb items={productDetail.breadcrumb} />

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[175px_auto_530px] lg:items-start lg:gap-10">
          {/* Mobile: Main Image pehle */}
          <div className="order-1 lg:order-2">
            <MainImage
              src={productDetail.images[activeImage]}
              alt={productDetail.name}
            />
          </div>

          {/* Mobile: Thumbnails baad mein */}
          <div className="order-2 lg:order-1">
            <ThumbnailColumn
              images={productDetail.images}
              activeIndex={activeImage}
              onSelect={setActiveImage}
            />
          </div>

          {/* Product Info */}
          <div className="order-3">
            <ProductInfo product={productDetail} />
          </div>
        </div>

        <ProductTabs activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "Rating & Reviews" && <ReviewsSection />}
        {activeTab === "Product Details" && (
          <p className="mt-8 max-w-2xl font-satoshi text-sm leading-relaxed text-black/60">
            {productDetail.description}
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
