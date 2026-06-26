import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "@/components/ScrollToTop";
import { LanguageProvider } from "@/i18n/LanguageContext";
import Loader from "@/components/Loader";
import Index from "./pages/Index";
import Villas from "./pages/Villas";
import Apartments from "./pages/Apartments";
import AccommodationDetail from "./pages/AccommodationDetail";
import Rentals from "./pages/Rentals";
import VehicleDetail from "./pages/VehicleDetail";
import Transfer from "./pages/Transfer";
import Locations from "./pages/Locations";
import LocationDetail from "./pages/LocationDetail";
import WorkWithUs from "./pages/WorkWithUs";
import Events from "./pages/Events";
import ChiSiamo from "./pages/ChiSiamo";
import Concierge from "./pages/Concierge";
import Contatti from "./pages/Contatti";
import NotFound from "./pages/NotFound";
import YachtsPage from "./pages/Yachts";
import Locali from "./pages/Locali";
import Eventi from "./pages/Eventi";
import EventoDetail from "./pages/EventoDetail";
import VenueDetail from "./pages/VenueDetail";

import BoatParty from "./pages/BoatParty";
import Excursions from "./pages/Excursions";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <AnimatePresence mode="wait">
          {loading && <Loader key="loader" />}
        </AnimatePresence>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/villas" element={<Villas />} />
            <Route path="/apartments" element={<Apartments />} />
            <Route path="/accommodation/:id" element={<AccommodationDetail />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/rentals/:slug" element={<VehicleDetail />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/locations/:slug" element={<LocationDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/chi-siamo" element={<ChiSiamo />} />
            <Route path="/concierge" element={<Concierge />} />
            <Route path="/contatti" element={<Contatti />} />
            <Route path="/work-with-us" element={<WorkWithUs />} />
            <Route path="/yachts" element={<YachtsPage />} />
            <Route path="/locali-eventi" element={<Eventi />} />
            <Route path="/locali" element={<Locali />} />
            <Route path="/eventi" element={<Eventi />} />
            <Route path="/eventi/:id" element={<EventoDetail />} />
            <Route path="/locali/:slug" element={<VenueDetail />} />
            {/* Yacht detail removed - gallery modal on main page */}
            <Route path="/boat-party" element={<BoatParty />} />
            <Route path="/excursions" element={<Excursions />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
  );
};

export default App;
