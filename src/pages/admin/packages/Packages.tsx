import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../../useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Plus, Pencil, MapPin} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import { AdminDashboardLayout } from '../layout/AdminDashboardLayout';
import { Link } from 'react-router-dom';
import { Roles } from '../../../ProtectedRouteProps';

interface Package {
  id: number;
  name: string;
  price: number;
  duration: number;
  status: string;
  description: string;
  profiles: number;
  createdAt: string;
}

const AdminPackages = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/packages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setPackages(response.data);
    } catch (error) {
      toast.error('Failed to fetch packages');
    } finally {
      setLoading(false);
    }
  };
  const hasPermission = (permissionName: Roles): boolean => {
    if (!user?.permissions) return false;
    return user.permissions.some(permission => permission.name === permissionName);
  };
  
  // Helper function to check if user can perform action
  const canPerformAction = (action: 'Editing' | 'Create' | 'Deletion'| 'Approval'): boolean => {
    if (!user) return false;
    
    // SUPERADMIN can do everything
    if (user.utype === 'SUPERADMIN') {
      return true;
    }
    
    // ADMIN can do everything
    if (user.utype === 'ADMIN') {
      return hasPermission(action);
    }
    
    // SUBADMIN needs specific permissions
    if (user.utype === 'SUBADMIN') {
      return hasPermission(action);
    }
    
    return false;
  };


  return (
    <AdminDashboardLayout title="Manage Packages" user={user}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Packages</h2>
          {canPerformAction('Create') && (
          <Button className="bg-[#a0b830] hover:bg-[#8fa029]">
            <Link to="/admin/create-package" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add Package</Link>
          </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-8">Loading packages...</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className="relative overflow-hidden transition-all duration-300 bg-lime-100 hover:shadow-xl hover:scale-105 group border-2 border-transparent hover:border-[#a0b830]"
              >
                {/* Premium badge for higher-priced packages */}
                {pkg.price > 50 && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-lime-300 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                   {pkg.status}
                  </div>
                )}

                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-800 dark:to-green-900 border-b pb-4">
                  <CardTitle className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800 dark:text-white">{pkg.name}</span>
                  
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6 p-6">
                  {/* Price section with better visual hierarchy */}
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-extrabold text-[#a0b830]">${pkg.price}</span>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                      /{pkg.duration} <span className="font-semibold">Year</span>{pkg.duration > 1 ? 's' : ''}
                    </span>
                  </div>

                  {/* Profiles section with icon */}
                  <div className="flex items-center justify-center bg-white dark:bg-gray-800 p-3 rounded-lg">
                   <MapPin className="h-5 w-5 text-[#a0b830] mr-2" />
                    <span className="text-2xl font-bold text-[#a0b830]">{pkg.profiles}</span>
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium">Zipcodes</span>
                  </div>

                  {/* Features list with improved styling */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Package Features:</h4>
                    <ul className="space-y-2">
                      {pkg.description.split('\\n').map((line, index) => (
                        <li key={index} className="flex items-start">
                          {/* <svg className="h-5 w-5 text-[#a0b830] mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg> */}
                          <span className="text-sm text-gray-700 dark:text-gray-300">{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Button section with hover effects */}
                  {canPerformAction('Editing') && (
                  <div className="flex justify-center pt-4">
                    <Link
                      to={`/admin/packages/${pkg.id}/edit`}
                      className="group relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-[#a0b830] border-2 border-[#a0b830] rounded-md shadow-md transition-all duration-300 ease-out hover:bg-[#a0b830] hover:text-white"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Package
                    </Link>
                  </div>
                  )}
                </CardContent>

                {/* Subtle corner decoration */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#a0b830] opacity-10 rounded-tl-full" />
              </Card>
            ))}
          </div>
        )}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminPackages;