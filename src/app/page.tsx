import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import FeaturedProperties from '@/components/FeaturedProperties';
import NewListings from '@/components/NewListings';
import PropertyCategories from '@/components/PropertyCategories';
import Testimonials from '@/components/Testimonials';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeaturedProperties />
        <NewListings />
        <PropertyCategories />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
