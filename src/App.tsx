import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import Balita from "@/pages/Balita";
import IbuHamil from "@/pages/IbuHamil";
import DSS from "@/pages/DSS";
import Peta from "@/pages/Peta";
import MealPlan from "@/pages/MealPlan";
import Jadwal from "@/pages/Jadwal";
import Laporan from "@/pages/Laporan";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/balita" element={<Balita />} />
            <Route path="/ibu-hamil" element={<IbuHamil />} />
            <Route path="/dss" element={<DSS />} />
            <Route path="/peta" element={<Peta />} />
            <Route path="/meal-plan" element={<MealPlan />} />
            <Route path="/jadwal" element={<Jadwal />} />
            <Route path="/laporan" element={<Laporan />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;