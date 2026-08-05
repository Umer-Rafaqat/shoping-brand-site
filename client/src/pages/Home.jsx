import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BrandsStrip from "@/components/BrandsStrip";
import NewArrivals from "@/components/NewArrivals";
import TopSelling from "@/components/TopSelling";
import DressStyle from "@/components/DressStyle";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      <AnnouncementBar />
      <Navbar />
      <Hero />
      <BrandsStrip />
      <NewArrivals />
      <TopSelling />
      <DressStyle />

      <Testimonials />
      <div className="-mb-20 relative z-10">
        <Newsletter />
      </div>
      <Footer />
    </div>
  );
}
