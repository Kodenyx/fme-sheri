
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Offer from "./pages/Offer";
import OfferBeta from "./pages/OfferBeta";
import Tool from "./pages/Tool";
import Auth from "./pages/Auth";
import Modal from "./pages/Modal";
import Modal1 from "./pages/Modal1";
import Modal3 from "./pages/Modal3";
import TagTest from "./pages/TagTest";
import NotFound from "./pages/NotFound";
import SocialCredits from "./pages/SocialCredits";
import AdminPanel from "./pages/AdminPanel";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
              <Route path="/admin-panel" element={<AdminPanel />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/modal" element={<Modal />} />
              <Route path="/modal1" element={<Modal1 />} />
              <Route path="/modal3" element={<Modal3 />} />
              <Route path="/tag-test" element={<TagTest />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
