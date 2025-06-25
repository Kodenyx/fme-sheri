
import { Menu, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navbar = () => {
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
          <a href="#tool">
            <Button 
              className="bg-gradient-to-r from-[#818CF8] to-[#06B6D4] text-black font-bold shadow-lg hover:opacity-90"
            >
              <Zap className="mr-2 h-4 w-4" />
              Try Tool
            </Button>
          </a>
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
                <a href="#tool" className="w-full">
                  <Button 
                    className="bg-gradient-to-r from-[#818CF8] to-[#06B6D4] w-full text-black font-bold shadow-lg hover:opacity-90"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Try Tool
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
