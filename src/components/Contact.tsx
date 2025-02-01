import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
            <p className="text-gray-600">
              Ready to transform your healthcare practice? Contact us for a free consultation.
            </p>
          </div>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input placeholder="Name" />
              <Input type="email" placeholder="Email" />
            </div>
            <Input placeholder="Subject" />
            <Textarea placeholder="Message" className="h-32" />
            <Button className="w-full bg-gradient-primary">Send Message</Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;