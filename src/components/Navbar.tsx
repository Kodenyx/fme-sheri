import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navItems = [
    { label: "Solutions", href: "#solutions" },
    { label: "Benefits", href: "#benefits" },
    { label: "Contact", href: "#contact" },
  ];

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/a7dfa721-4b28-4fba-b283-e3aea386b100.png" 
            alt="KodenyxAI Logo" 
            className="h-10 w-10"
          />
          <span className="text-xl font-bold text-black">KodenyxAI</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
          {isAuthenticated && (
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="border-2 border-gray-200"
            >
              Sign Out
            </Button>
          )}
          <a 
            href="https://cal.com/aarti-anand82" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <Button 
              className="bg-gradient-to-r from-[#818CF8] to-[#06B6D4] text-black font-bold shadow-lg hover:opacity-90"
            >
              <Phone className="mr-2 h-4 w-4" />
              Book A Demo
            </Button>
          </a>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col space-y-4 mt-8">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-lg text-gray-600 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                {isAuthenticated && (
                  <Button 
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full border-2 border-gray-200"
                  >
                    Sign Out
                  </Button>
                )}
                <a 
                  href="https://cal.com/aarti-anand82" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button 
                    className="bg-gradient-to-r from-[#818CF8] to-[#06B6D4] w-full text-black font-bold shadow-lg hover:opacity-90"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Book A Demo
                  </Button>
                </a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;