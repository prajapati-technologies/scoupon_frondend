import { useState, useEffect } from "react";
import { useAuth } from "../../useAuth";
import { DashboardLayout } from "./DashboardLayout";
import ZipCodeManagement from "./ZipCodeManagement";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { Zipcode } from "../../ProtectedRouteProps";



const AddZipcode = () => {
  const { user } = useAuth();
  const [zipcodes, setZipcodes] = useState<Zipcode[]>([]);
  const [totalZipcodes, setTotalZipcodes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setZipcodes(response.data.zipcodes || []);
        setTotalZipcodes(response.data.totalzipcodes || 0);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load ZIP codes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleZipcodesChange = (newZipcodes: Zipcode[]) => {
    setZipcodes(newZipcodes);
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Manage ZIP Codes" user={user}>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#a0b830] mx-auto" />
            <p className="mt-2">Loading ZIP codes...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manage ZIP Codes" user={user}>
      <div className="max-w-4xl mx-auto py-6">
        <ZipCodeManagement
          zipcodes={zipcodes}
          totalZipcodes={totalZipcodes}
          onZipcodesChange={handleZipcodesChange}
        />
      </div>
    </DashboardLayout>
  );
};

export default AddZipcode; 