
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
                Coming Soon
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The Messaging Makeover AI tool is currently in development. Check back soon for access to transform your emails with proven behavioral psychology frameworks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthPrompt;
