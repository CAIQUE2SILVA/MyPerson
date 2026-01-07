import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/sections/HeroSection";
import FeaturedProducts from "./components/sections/FeaturedProducts";
import CategoriesSection from "./components/sections/CategoriesSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
      <Footer />
    </div>
  );
}
