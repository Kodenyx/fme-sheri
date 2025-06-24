
import { Button } from "@/components/ui/button";
import { LogIn, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthPrompt = () => {
  const navigate = useNavigate();

  return (
    <section id="tool" className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="mb-8">
              <User className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <h2 className="text-3xl font-bold mb-4 text-gray-900">
                Sign In Required
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Create a free account to access the Messaging Makeover AI tool and transform your emails with proven behavioral psychology frameworks.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-[#818CF8] to-[#06B6D4] hover:from-[#6366F1] hover:to-[#0891B2] text-white font-bold text-xl py-6 px-12 rounded-full shadow-lg transform transition-all hover:scale-105"
              >
                <LogIn className="mr-3 h-6 w-6" />
                Sign In to Get Started
              </Button>
              
              <p className="text-sm text-gray-500">
                Free account • No credit card required • Instant access
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthPrompt;
