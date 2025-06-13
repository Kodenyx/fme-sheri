
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Target, MessageCircle } from "lucide-react";

const SolutionSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            The Messaging Makeover AI Difference
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powered by Sherry Otto's proprietary frameworks that have generated millions in revenue
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none shadow-xl">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Behavioral Psychology</h3>
                  <p className="text-gray-600">Uses proven psychological triggers that make people want to read and respond</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Outcome-Focused</h3>
                  <p className="text-gray-600">Transforms feature-heavy copy into benefit-driven messaging that converts</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Voice Consistency</h3>
                  <p className="text-gray-600">Maintains your brand voice while making your message irresistibly clear</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
