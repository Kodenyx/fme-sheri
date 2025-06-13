
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Snowflake, Megaphone, RotateCcw } from "lucide-react";

const categories = [
  {
    icon: Snowflake,
    title: "Cold Outreach",
    description: "Transform generic cold emails into personalized, compelling messages that get responses",
    fixes: ["Weak subject lines", "Generic opening lines", "Feature-heavy pitches", "Weak CTAs"]
  },
  {
    icon: Megaphone,
    title: "Promotional Emails", 
    description: "Turn pushy sales emails into value-driven messages that make people want to buy",
    fixes: ["Salesy language", "Benefit confusion", "Urgency overload", "Unclear offers"]
  },
  {
    icon: RotateCcw,
    title: "Re-engagement",
    description: "Revive dead email lists with messages that win back lost subscribers and customers", 
    fixes: ["Boring check-ins", "Guilt-trip messaging", "One-size-fits-all", "No clear next step"]
  }
];

const WhatYouGet = () => {
  return (
    <section id="examples" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            What You Get
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered makeovers for every type of email in your business
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Card key={index} className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">AI Fixes:</h4>
                  <ul className="space-y-1">
                    {category.fixes.map((fix, fixIndex) => (
                      <li key={fixIndex} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                        {fix}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatYouGet;
