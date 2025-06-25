
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Wand2, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "1",
    title: "Paste Your Email",
    description: "Drop in your draft, template, or any email that's not performing"
  },
  {
    icon: Wand2,
    step: "2", 
    title: "AI Analysis",
    description: "Our AI identifies problems and applies Sherry's proven frameworks instantly"
  },
  {
    icon: Download,
    step: "3",
    title: "Get Your Makeover",
    description: "Receive a rewritten email that's behaviorally-smart and conversion-optimized"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Get professional email makeovers in under 3 seconds
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden border-none shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="absolute top-4 right-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{step.step}</span>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-[#818CF8] to-[#06B6D4] rounded-full flex items-center justify-center mb-4 mx-auto">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
