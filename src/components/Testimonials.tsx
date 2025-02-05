import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah C.",
    role: "Fractional CFO",
    company: "",
    content: "The AI automation has completely transformed how we handle customer support. We're saving over 25 hours weekly on routine inquiries alone.",
    image: "/placeholder.svg"
  },
  {
    name: "Jason Wickam",
    role: "VP/General Manager",
    company: "Sparro",
    content: "Working with Kodenyx on a complex Industrial IoT Fleet project has been exceptional. Their expertise in solving business challenges, automating workflows, and delivering impactful data played a key role in advancing the RFP process and pilot expansion. We look forward to winning more enterprise opportunities together.",
    image: "/placeholder.svg"
  },
  {
    name: "Tim Lee",
    role: "Founder",
    company: "Movement Mastery Training",
    content: "Kodenyx's AI powered solutions have made an exponential impact in my online presence.",
    image: "/placeholder.svg"
  }
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-16 h-16 mb-4">
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                  <div>
                    <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <p className="text-sm text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;