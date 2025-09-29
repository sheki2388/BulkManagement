import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BulkManageTabs from "./components/BulkManageTabs";
import NestedTabsDemo from "./components/NestedTabsDemo";
import NotFound from "./pages/NotFound";
import SidebarTabsDemo from "./components/SidebarTabsDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
  <BrowserRouter basename="/bulk">
        <Routes>
          <Route path="/" element={<BulkManageTabs />} />
          <Route path="/nested-tabs" element={<NestedTabsDemo />} />
          <Route path="/sidebar-tabs" element={<SidebarTabsDemo />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
