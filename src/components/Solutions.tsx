import { Headphones, MessageSquare, Robot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const solutions = [
  {
    title: "AI Voice Agents",
    description: "Intelligent voice assistants that handle appointment scheduling and patient inquiries 24/7.",
    icon: Headphones,
  },
  {
    title: "AI Chatbots",
    description: "Smart chatbots that provide instant responses to common questions and guide patients through basic processes.",
    icon: MessageSquare,
  },
  {
    title: "Custom Automation",
    description: "Tailored automation solutions that streamline your specific workflow and administrative tasks.",
    icon: Robot,
  },
];

const Solutions = () => {
  return (
    <section id="solutions" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Solutions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive AI solutions designed specifically for healthcare providers
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {solutions.map((solution) => (
            <Card key={solution.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <solution.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle>{solution.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{solution.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;