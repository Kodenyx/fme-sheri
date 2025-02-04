import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "https://api.convertkit.com/v3/forms/7636289/subscribe",
        {
          api_key: "3vcrjfR5Yfz3e1Se2AzGHQ",
          email,
          first_name: name,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.status === 200) {
        toast({
          title: "Success!",
          description: "Thank you for subscribing. We'll be in touch soon!",
        });
        setEmail("");
        setName("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
      console.error('Subscription error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Free AI Automation Playbook</h2>
            <p className="text-gray-600">
              Discover How Businesses Are Saving 20+ Hours a Week with AI
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input 
                placeholder="Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black hover:bg-black/90 text-white font-bold text-lg rounded-xl shadow-lg"
            >
              {isSubmitting ? "Submitting..." : "Get started"} 
              <ArrowRight className="ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;