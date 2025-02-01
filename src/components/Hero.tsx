import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="pt-32 pb-16 bg-gradient-primary text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI-Powered Healthcare Solutions
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-100">
              Transform your healthcare practice with intelligent automation. Our AI agents handle appointments, inquiries, and follow-ups, letting you focus on patient care.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Healthcare AI"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;