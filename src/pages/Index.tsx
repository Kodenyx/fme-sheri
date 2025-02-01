import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Solutions from "@/components/Solutions";
import Benefits from "@/components/Benefits";
import Contact from "@/components/Contact";
import FAQs from "@/components/FAQs";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Solutions />
      <Benefits />
      <FAQs />
      <Contact />
    </div>
  );
};

export default Index;