import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Loader2 } from "lucide-react";

export default function DashboardLayout() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        
        <SidebarInset className="flex-1 pb-20 lg:pb-0">
          {/* Desktop Header */}
          <header className="hidden lg:flex h-14 border-b border-border items-center px-4 sticky top-0 bg-background/95 backdrop-blur z-10">
            <SidebarTrigger className="mr-4" />
          </header>
          
          {/* Mobile Header */}
          <header className="lg:hidden h-14 border-b border-border flex items-center px-4 sticky top-0 bg-background/95 backdrop-blur z-10">
            <h1 className="text-lg font-semibold text-foreground">Medannot</h1>
          </header>
          
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </SidebarInset>
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </SidebarProvider>
  );
}
