import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../../components/ui/sheet";
import { Button } from "../../../components/ui/button";
import { AdminHeader } from "../components/AdminHeader";
import AdminSidebar from "../../components/sidebar/AdminSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  user: any;
}

export const AdminDashboardLayout = ({ children, title, user }: DashboardLayoutProps) => {
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
              <AdminHeader title={title} user={user} />
            </div>
          </header>

          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebar />
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
          <AdminSidebar />
        </aside>
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader title={title} user={user} />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};