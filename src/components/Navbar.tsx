
import { Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navItems = [
    { label: "How It Works", href: "#examples" },
    { label: "Examples", href: "#examples" },
    { label: "Try It Now", href: "#tool" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-md z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">Messaging Makeover AI</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
          {user ? (
            <div className="flex items-center gap-4">
              <a href="#tool">
                <Button 
                  className="bg-gradient-to-r from-[#818CF8] to-[#06B6D4] text-black font-bold shadow-lg hover:opacity-90"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Use Tool
                </Button>
              </a>
              <UserMenu />
            </div>
          ) : (
            <a href="/auth">
              <Button 
                className="bg-gradient-to-r from-[#818CF8] to-[#06B6D4] text-black font-bold shadow-lg hover:opacity-90"
              >
                Sign In
              </Button>
            </a>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-white" />
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
                {user ? (
                  <>
                    <a href="#tool" className="w-full">
                      <Button 
                        className="bg-gradient-to-r from-[#818CF8] to-[#06B6D4] w-full text-black font-bold shadow-lg hover:opacity-90"
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        Use Tool
                      </Button>
                    </a>
                    <div className="pt-4 border-t">
                      <UserMenu />
                    </div>
                  </>
                ) : (
                  <a href="/auth" className="w-full">
                    <Button 
                      className="bg-gradient-to-r from-[#818CF8] to-[#06B6D4] w-full text-black font-bold shadow-lg hover:opacity-90"
                    >
                      Sign In
                    </Button>
                  </a>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
