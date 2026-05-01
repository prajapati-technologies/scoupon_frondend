import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Building2, Loader2, Mail, Phone, Globe, MapPin, Facebook, Instagram, Linkedin, Youtube, Tag } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { DashboardLayout } from "./DashboardLayout";
import { User, Zipcode } from "../../ProtectedRouteProps";
import InfoItem from "../../InfoItem";

const Profile = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
      PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
      SUSPENDED: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
      BLOCKED: { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-200" }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} ${config.border}`}>
        {status}
      </span>
    );
  };

  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setIsFetching(false);
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout title="Vendor Profile" user={user}>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#a0b830]" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Vendor Profile" user={user}>
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {user && (
          <Card className="border border-gray-200 bg-white shadow-sm overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
                <div className="w-32 h-32 mb-4 sm:mb-0 flex-shrink-0">
                  {user.companyLogo ? (
                    <img
                      src={user.companyLogo}
                      alt={`${user.company || user.businessName} Logo`}
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                      <Building2 className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {user.company || user.name}
                  </CardTitle>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">{user.email}</a>
                    </div>
                    {user.phone && (
                      <div className="flex items-center justify-center sm:justify-start space-x-2">
                        <Phone className="w-4 h-4 text-gray-600" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-center sm:justify-start">
                      {renderStatusBadge(user.status)}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              {/* Business Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Business Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoItem icon={Building2} label="Business Name" value={user.company} />
                  <InfoItem icon={Tag} label="Service Type" value={user.vendorType} />
                  <InfoItem icon={Building2} label="About" value={user.about} />
                  <InfoItem icon={MapPin} label="Address" value={user.address} />
                  <InfoItem icon={MapPin} label="City" value={user.city} />
                  <InfoItem icon={MapPin} label="State" value={user.state} />
                  <InfoItem icon={MapPin} label="Country" value={user.country} />
                  <InfoItem icon={Globe} label="Website" value={user.webUrl} isLink />
                </div>
              </div>

              {/* Social Media */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Social Media
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoItem icon={Facebook} label="Facebook" value={user.fb} isLink />
                  <InfoItem icon={Instagram} label="Instagram" value={user.in} isLink />
                  <InfoItem icon={Linkedin} label="LinkedIn" value={user.ln} isLink />
                  <InfoItem icon={Youtube} label="YouTube" value={user.yt} isLink />
                </div>
              </div>

              {/* Zip Codes */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                  Service Areas (ZIP Codes)
                </h3>
                {(() => {
                  // Collect all zipcodes from all active subscribe_packages
                  const allZipcodes = user.subscribe_packages?.reduce((acc: any[], packageItem) => {
                    if (packageItem.status === 'ACTIVE' && packageItem.zipCodes && packageItem.zipCodes.length > 0) {
                      return [...acc, ...packageItem.zipCodes];
                    }
                    return acc;
                  }, []) || [];

                  return allZipcodes.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {allZipcodes.map((zipcode: Zipcode) => (
                        <div 
                          key={zipcode.id}
                          className="bg-gray-50 rounded-lg p-3 text-center"
                        >
                          <span className="font-medium text-gray-700">{zipcode.zipcode}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 italic">No ZIP codes added yet.</p>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      <ToastContainer />
    </DashboardLayout>
  );
};

// Helper component for info items


export default Profile;