
import { Card, CardContent } from "@/components/ui/card";
import { X, AlertTriangle, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: X,
    title: "Generic Template Trap",
    description: "You're using the same boring templates everyone else uses, making your emails blend into the noise."
  },
  {
    icon: AlertTriangle,
    title: "Feature-Focused Mistake",
    description: "You're talking about what you do instead of what your reader gets, losing them in the first line."
  },
  {
    icon: TrendingDown,
    title: "Conversion Killer Words",
    description: "Your subject lines and CTAs are accidentally triggering spam filters and turning off prospects."
  }
];

const ProblemSection = () => {
  return (
    <section className="py-20 bg-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Why Your Emails Are Getting Ignored
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Most founders make these 3 critical mistakes that kill email performance
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <Card key={index} className="border-red-200 shadow-lg">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <problem.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{problem.title}</h3>
                <p className="text-gray-600">{problem.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
