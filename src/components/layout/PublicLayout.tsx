import { ReactNode } from 'react';
import Header from '../../pages/components/home/Header';
import Footer from '../../pages/components/home/Footer';
import { useAuth } from '../../useAuth';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

interface PublicLayoutProps {
  children: ReactNode;
  className?: string;
}

const PublicLayout = ({ children, className = '' }: PublicLayoutProps) => {
  const { user, isAuthenticated } = useAuth();

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.utype) {
      case 'SUPERADMIN':
      case 'ADMIN':
      case 'SUBADMIN':
        return '/admin/dashboard';
      case 'VENDOR':
        return '/vendor/dashboard';
      default:
        return '/';
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      <Header />
      <main className="flex-grow pt-16">
        {/* Dashboard Link for Authenticated Users */}
        {isAuthenticated && user && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to={getDashboardPath()}>
              <Button 
                variant="outline" 
                className="bg-white hover:bg-gray-50 border-[#a0b830] text-[#a0b830] hover:text-[#8fa029]"
                onClick={() => sessionStorage.removeItem('stayOnPublic')}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
