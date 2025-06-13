
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Zap } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const [email, setEmail] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate processing
    setTimeout(() => {
      toast({
        title: "Makeover Complete!",
        description: "Your improved email is ready. Check your inbox for the transformation!",
      });
      setEmail("");
      setEmailContent("");
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <section id="tool" className="py-20 bg-gradient-primary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Ready for Your Email Makeover?
            </h2>
            <p className="text-xl text-gray-600">
              Paste your email below and watch Sherry's AI transform it into conversion gold
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Your Email Address
              </label>
              <Input 
                id="email"
                type="email" 
                placeholder="where@should.we.send.your.makeover.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <div>
              <label htmlFor="emailContent" className="block text-sm font-medium text-gray-700 mb-2">
                Paste Your Email Content Here
              </label>
              <Textarea 
                id="emailContent"
                placeholder="Subject: Your current subject line

Hi [Name],

Paste your entire email here - subject line, body, CTA, everything. The AI will analyze it all and give you a complete makeover..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                required
                className="min-h-48"
              />
            </div>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black hover:bg-black/90 text-white font-bold text-lg py-4 rounded-xl shadow-lg"
            >
              {isSubmitting ? (
                "Creating Your Makeover..."
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Get My Instant Makeover (FREE)
                </>
              )}
            </Button>
            <p className="text-center text-sm text-gray-500">
              🔒 We'll never share your content. Your makeover arrives in under 60 seconds.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
