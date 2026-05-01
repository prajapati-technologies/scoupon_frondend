import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle, CreditCard, Package, Users } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { useAuth } from "../../useAuth";
import { WelcomeCard } from "./components/WelcomeCard";
import { AdminDashboardLayout } from "./layout/AdminDashboardLayout";
import axios from "axios";

const AdminDashbaord = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalPendingApprovals: 0,
    totalPackages: 0,
    totalUsers: 0,
    totalTransactions: 0,
    totalCompletedTransactions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStats(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Clear the stayOnPublic flag when user enters dashboard
    sessionStorage.removeItem('stayOnPublic');
  }, []);

  return (
    <AdminDashboardLayout title="Admin Dashboard" user={user}>
      <div className="space-y-6">
        <WelcomeCard user={user} />

        {/* Dashboard Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Vendors</p>
                <h3 className="text-2xl font-bold">{loading ? "Loading..." : stats.totalVendors}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                <h3 className="text-2xl font-bold">{loading ? "Loading..." : stats.totalPendingApprovals}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="bg-green-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Packages</p>
                <h3 className="text-2xl font-bold">{loading ? "Loading..." : stats.totalPackages}</h3>
              </div>
            </CardContent>
          </Card>

          

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold">{loading ? "Loading..." : stats.totalUsers}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="bg-teal-100 p-3 rounded-full">
                <CreditCard className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Transactions</p>
                <h3 className="text-2xl font-bold">{loading ? "Loading..." : stats.totalTransactions}</h3>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="bg-orange-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed Transactions</p>
                <h3 className="text-2xl font-bold">
                  {loading ? "Loading..." : stats.totalCompletedTransactions}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

       
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashbaord;