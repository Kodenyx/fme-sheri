import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Offer from "./pages/Offer";
import OfferBeta from "./pages/OfferBeta";
import Tool from "./pages/Tool";
import Auth from "./pages/Auth";
import Modal from "./pages/Modal";
import Modal1 from "./pages/Modal1";
import NotFound from "./pages/NotFound";
import SocialCredits from "./pages/SocialCredits";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Offer />} />
            <Route path="/home" element={<Index />} />
            <Route path="/main" element={<Index />} />
            <Route path="/offer" element={<Offer />} />
            <Route path="/offerbeta" element={<OfferBeta />} />
            <Route path="/tool" element={<Tool />} />
            <Route path="/social-credits" element={<SocialCredits />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/modal" element={<Modal />} />
            <Route path="/modal1" element={<Modal1 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
