
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import HowItWorks from "@/components/HowItWorks";
import WhatYouGet from "@/components/WhatYouGet";
import AboutCreator from "@/components/AboutCreator";
import Testimonials from "@/components/Testimonials";
import FAQs from "@/components/FAQs";
import Contact from "@/components/Contact";

const Index = () => {
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);

  const scrollToTestimonials = () => {
    testimonialsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToFAQs = () => {
    faqsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Navbar 
        onTestimonialsClick={scrollToTestimonials}
        onFAQsClick={scrollToFAQs}
      />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <HowItWorks />
      <WhatYouGet />
      <AboutCreator />
      <div ref={testimonialsRef}>
        <Testimonials />
      </div>
      <div ref={faqsRef}>
        <FAQs />
      </div>
      <Contact />
    </div>
  );
};

export default Index;
