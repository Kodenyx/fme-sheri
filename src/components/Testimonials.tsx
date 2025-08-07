import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Rachel Pedersen",
    role: "Social Media Expert",
    company: "300K LinkedIn Followers",
    content: "I'm a total nerd for behavioral science... So when I saw how FixMyEmail instantly upgraded basic email copy into proven copy (backed by the science of human-behavior, too!), I fell in love.",
    image: "/placeholder.svg",
    rating: 5
  },
  {
    name: "John Frydman",
    role: "Founder AI Expert",
    company: "Digismart.io",
    content: "The output is really better than all the other methods/apps/GenAI that I have tested so far (and that's a lot of them)",
    image: "/placeholder.svg",
    rating: 5
  },
  {
    name: "Shriya Prasanna",
    role: "Founder and CEO",
    company: "Good On Digital",
    content: "I was impressed by how the tool delivered a well-crafted message backed with scientific reasoning.",
    image: "/placeholder.svg",
    rating: 5
  },
  {
    name: "Jacob Statler",
    role: "Founder",
    company: "Stat Digital",
    content: "The hook plays into the desire and intent of the lead.",
    image: "/placeholder.svg",
    rating: 5
  },
  {
    name: "Manali Hanamsagar",
    role: "Fractional Head of Growth",
    company: "Monetization for B2B/B2C Startups",
    content: "What a great tool! Dropped in an email and it definitely stepped it up for me. Can't wait to use it more!",
    image: "/placeholder.svg",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 relative overflow-hidden">
      {/* Fun background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            People Are Going Wild! 🔥
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what happens when emails actually work
          </p>
        </div>

        {/* Masonry-style layout */}
        <div className="max-w-6xl mx-auto">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={`
                break-inside-avoid mb-6 border-none shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105
                bg-gradient-to-br from-white to-gray-50 relative overflow-hidden
                ${index === 0 ? 'lg:-rotate-2 hover:rotate-0' : index === 2 ? 'lg:rotate-2 hover:rotate-0' : ''}
              `}>
                {/* Fun accent elements - colorful borders on top */}
                <div className={`absolute top-0 left-0 w-full h-2 ${
                  index === 0 ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 
                  index === 1 ? 'bg-gradient-to-r from-blue-400 to-purple-400' :
                  index === 2 ? 'bg-gradient-to-r from-pink-400 to-yellow-400' :
                  index === 3 ? 'bg-gradient-to-r from-green-400 to-blue-400' :
                  'bg-gradient-to-r from-orange-400 to-red-400'
                }`}></div>

                <CardContent className="p-8">
                  <div className="flex flex-col">
                    {/* Quote icon */}
                    <Quote className={`w-8 h-8 mb-4 ${
                      index === 0 ? 'text-purple-400' : 
                      index === 1 ? 'text-blue-400' :
                      index === 2 ? 'text-pink-400' :
                      index === 3 ? 'text-green-400' :
                      'text-orange-400'
                    }`} />

                    {/* Star rating */}
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>

                    {/* Content */}
                    <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    {/* Author info */}
                    <div className="flex items-center">
                      <Avatar className="w-14 h-14 mr-4 ring-4 ring-white shadow-lg">
                        <AvatarImage src={testimonial.image} alt={testimonial.name} />
                        <AvatarFallback className={`text-white font-bold ${
                          index === 0 ? 'bg-gradient-to-br from-purple-400 to-pink-400' : 
                          index === 1 ? 'bg-gradient-to-br from-blue-400 to-purple-400' :
                          index === 2 ? 'bg-gradient-to-br from-pink-400 to-yellow-400' :
                          index === 3 ? 'bg-gradient-to-br from-green-400 to-blue-400' :
                          'bg-gradient-to-br from-orange-400 to-red-400'
                        }`}>
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                        <p className="text-gray-600 font-medium">{testimonial.role}</p>
                        <p className="text-gray-500 text-sm">{testimonial.company}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Fun CTA */}
        <div className="text-center mt-16">
          <p className="text-2xl font-bold text-gray-700 mb-4">
            Ready to join the email revolution? 🚀
          </p>
          <p className="text-lg text-gray-600">
            Your next email could be your best email yet!
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
