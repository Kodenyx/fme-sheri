import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="pt-32 pb-16 bg-gradient-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            AI-Powered Healthcare Solutions
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-600">
            Transform your healthcare practice with intelligent automation. Our AI agents handle appointments, inquiries, and follow-ups, letting you focus on patient care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;