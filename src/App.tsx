import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import FAQPage from "./pages/FAQ";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import MyAccount from "./pages/MyAccount";
import NotFound from "./pages/NotFound";
import GalleryPhotos from "./pages/GalleryPhotos";
import { GalleryTour, GalleryLessons } from "./pages/GalleryVideo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/gallery/photos" element={<GalleryPhotos />} />
              <Route path="/gallery/tour" element={<GalleryTour />} />
              <Route path="/gallery/lessons" element={<GalleryLessons />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
