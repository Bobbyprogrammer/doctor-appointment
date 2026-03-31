import HeroSection from "@/features/home/hero-section"
import ServicesPreview from "@/features/home/services-preview"
import HowItWorks from "@/features/home/how-it-works"
import WhyChooseUs from "@/features/home/why-choose-us"
import Testimonials from "@/features/home/testimonials"
import BlogPreview from "@/features/home/blog-preview"
import FAQPreview from "@/features/home/faq-preview"
import CTASection from "@/features/home/cta-section"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-20">
    
      <HeroSection />
      <ServicesPreview />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
      <BlogPreview />
      <FAQPreview />
      <CTASection />
   
    </div>
  );
}