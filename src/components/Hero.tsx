
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-16 bg-gradient-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-gray-900">
            Turn Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#818CF8] to-[#06B6D4]">
              Cringe Emails
            </span>{" "}
            Into Conversion Gold
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-600 max-w-3xl mx-auto">
            For founders and marketers who know their emails suck but don't know how to fix them. Get instant makeovers using Sherry Otto's proven frameworks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#tool">
              <Button 
                size="lg" 
                className="bg-black text-white hover:bg-black/90 text-lg py-6 px-8"
              >
                <Zap className="mr-2 h-4 w-4" />
                Fix My Messaging Now
              </Button>
            </a>
            <a href="#examples">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-gray-200 text-gray-700 hover:bg-gray-50 text-lg py-6 px-8"
              >
                See Examples
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
