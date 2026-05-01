import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "./DashboardLayout";
import UserProfilesCard, { UserProfile } from "./UserProfileCard";
import { User} from '../../ProtectedRouteProps';
import axios from 'axios';
// import { Button } from '../../components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
// import { MapPin } from 'lucide-react';
// import ZipCodeManagement from './ZipCodeManagement';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  // const [zipcodes, setZipcodes] = useState<Zipcode[]>([]);
  // const [showZipCodeManagement, setShowZipCodeManagement] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUser(response.data);
      console.log('user',response.data);
      // setZipcodes(response.data.zipcodes || []);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    fetchUser();
    // Clear the stayOnPublic flag when user enters dashboard
    sessionStorage.removeItem('stayOnPublic');
  }, []);

  const handleCompleteProfile = () => {
    navigate("/vendor/profile/update");
  };

  // Function to safely transform User to UserProfile
  const getUserProfile = (user: User): UserProfile => {
    // Collect all zipcodes from all active subscribe_packages
    const allZipcodes = user.subscribe_packages?.reduce((acc: any[], packageItem) => {
      if (packageItem.status === 'ACTIVE' && packageItem.zipCodes && packageItem.zipCodes.length > 0) {
        return [...acc, ...packageItem.zipCodes];
      }
      return acc;
    }, []) || [];

    return {
      ...user,
      zipcodes: allZipcodes // All zipcodes from all active packages
    };
  };

  // const handleZipcodesChange = (newZipcodes: Zipcode[]) => {
  //   setZipcodes(newZipcodes);
  //   // Update the user object with new zipcodes
  //   if (user) {
  //     setUser({
  //       ...user,
  //       zipcodes: newZipcodes,
  //       addedzipcodes: newZipcodes.length
  //     });
  //   }
  // };
  const refreshUserData = () => {
    fetchUser();
  };

  return (
    <DashboardLayout title="Vendor Dashboard" user={user}>
      <div className="space-y-6">
        {user && (
          <UserProfilesCard 
            user={getUserProfile(user)}
            onCompleteProfile={handleCompleteProfile} 
            refreshUserData={refreshUserData}
          />
        )}
        
        {/* Dashboard Content */}
        {/* <div className="bg-white shadow-lg rounded-xl justify-center p-6 max-w-7xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1"> */}
          {/* ZIP Code Management Card */}
          {/* {user?.packageActive === 'YES' && user?.status === 'ACTIVE' && (
            <Card>
              <CardHeader>
                <CardTitle>ZIP Code Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">
                    Manage your service area by adding ZIP codes. You can add up to {user?.totalzipcodes || 0} ZIP codes.
                    Currently using {user?.addedzipcodes || 0} of {user?.totalzipcodes || 0} ZIP codes.
                  </p>
                  {/* <Button
                    onClick={() => setShowZipCodeManagement(true)}
                    className="w-full bg-[#a0b830] hover:bg-[#8fa029] text-white"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Manage ZIP Codes
                  </Button> */}
                {/* </div>
              </CardContent>
            </Card> */}
          {/* )} */} 
        {/* </div>
        </div> */}

        {/* ZIP Code Management Modal */}
        {/* {showZipCodeManagement && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
              <ZipCodeManagement
                zipcodes={zipcodes}
                totalZipcodes={user?.totalzipcodes || 0}
                onZipcodesChange={handleZipcodesChange}
              />
              <Button
                onClick={() => setShowZipCodeManagement(false)}
                className="mt-4 w-full"
                variant="outline"
              >
                Close
              </Button>
            </div>
          </div>
        )} */}
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;