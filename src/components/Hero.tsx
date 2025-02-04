import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="pt-32 pb-16 bg-gradient-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900">
            AI-Powered{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#818CF8] to-[#06B6D4]">
              Voice and Chatbased
            </span>{" "}
            Solutions
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-3xl mx-auto">
            Transform your healthcare practice with intelligent automation. Our AI agents handle appointments, inquiries, and follow-ups, letting you focus on patient care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://cal.com/aarti-anand82"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button 
                size="lg" 
                className="bg-black text-white hover:bg-black/90 text-lg py-6 px-8"
              >
                Book A Demo
              </Button>
            </a>
            <a href="#contact">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 text-lg py-6 px-8"
              >
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;