import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
            <p className="text-gray-600">
              Ready to transform your healthcare practice? Let's begin with your details.
            </p>
          </div>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input placeholder="Name" />
              <Input type="email" placeholder="Email" />
            </div>
            <Button className="w-full bg-black hover:bg-black/90 text-white font-bold text-lg rounded-xl shadow-lg">
              Get started <ArrowRight className="ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;