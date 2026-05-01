import { Menu } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import VendorSidebar from "../components/sidebar/VendorSidebar";
import { DashboardHeader } from "../components/headers/DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  user: any;
}

export const DashboardLayout = ({ children, title, user }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col h-screen">
        <Sheet>
          <header className="border-b">
            <div className="flex h-16 items-center px-4 gap-4">
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <DashboardHeader title={title} user={user} />
            </div>
          </header>

          <SheetContent side="left" className="w-64 p-0">
            <VendorSidebar />
          </SheetContent>
        </Sheet>
        
        {/* Mobile Main Content */}
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen">
        <aside className="w-64 border-r h-screen sticky top-0">
          <VendorSidebar />
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
          <DashboardHeader title={title} user={user} />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};