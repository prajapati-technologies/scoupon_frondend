import { useState } from "react";
import { PlusCircle, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useAuth } from "../../useAuth";
import { Link } from "react-router-dom";
import { Zipcode } from "../../ProtectedRouteProps";

interface ZipCodeManagementProps {
  zipcodes: Zipcode[];
  totalZipcodes: number;
  onZipcodesChange: (newZipcodes: Zipcode[]) => void;
}

const ZipCodeManagement = ({ zipcodes, totalZipcodes, onZipcodesChange }: ZipCodeManagementProps) => {
  const [newZipcode, setNewZipcode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleAddZipcode = async () => {
    if (!newZipcode.trim()) {
      toast.error("Please enter a ZIP code");
      return;
    }

    // Validate ZIP code format (assuming US ZIP code format)
    const zipCodeRegex = /^\d{5}(-\d{4})?$/;
    if (!zipCodeRegex.test(newZipcode.trim())) {
      toast.error("Please enter a valid ZIP code (e.g., 12345 or 12345-6789)");
      return;
    }

    if (zipcodes.length >= totalZipcodes) {
      toast.error(`You can only add up to ${totalZipcodes} ZIP codes. Please upgrade your package.`);
      return;
    }

    if (zipcodes.some(z => z.zipcode === newZipcode)) {
      toast.error("This ZIP code is already added");
      return;
    }

    if (!user?.id) {
      toast.error("User information not found. Please try logging in again.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/zipcode`,
        { 
          zipcode: newZipcode,
          userId: user.id 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        const newZipcodes = [...zipcodes, response.data];
        onZipcodesChange(newZipcodes);
        setNewZipcode("");
        toast.success("ZIP code added successfully!");
      }
    } catch (error: any) {
      console.error("Error adding ZIP code:", error);
      const errorMessage = error.response?.data?.message || "Failed to add ZIP code. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveZipcode = async (zipcode: Zipcode) => {
    if (!user?.id) {
      toast.error("User information not found. Please try logging in again.");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/zipcode/${zipcode.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Remove the ZIP code from the list
      const newZipcodes = zipcodes.filter(z => z.id !== zipcode.id);
      onZipcodesChange(newZipcodes);
      toast.success("ZIP code removed successfully!");
    } catch (error: any) {
      console.error("Error removing ZIP code:", error);
      const errorMessage = error.response?.data?.message || "Failed to remove ZIP code. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.packageActive === 'NO') {
    return (
      <div className="bg-red-500 text-white p-4 rounded-md mb-4">
        <p className="mb-5">You are not subscribed to any package. Please subscribe to a package to manage ZIP codes.</p>
        <Link to="/vendor/subscriptions" className="bg-[#a0b830] hover:bg-[#8fa029] text-white px-4 py-2 rounded-md my-2">
          Subscribe
        </Link>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ZIP Code Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            ZIP codes: {zipcodes.length} of {totalZipcodes} used
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            id="newZipcode"
            value={newZipcode}
            onChange={(e) => setNewZipcode(e.target.value)}
            placeholder="Enter ZIP code (e.g., 12345)"
            disabled={isLoading}
            maxLength={10}
          />
          <Button
            type="button"
            onClick={handleAddZipcode}
            className="bg-[#a0b830] hover:bg-[#8fa029] text-white"
            disabled={isLoading || zipcodes.length >= totalZipcodes}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-1" /> Add
              </>
            )}
          </Button>
        </div>

        <div className="mt-4">
          <Label>Current ZIP Codes</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {zipcodes.length === 0 ? (
              <p className="text-sm text-gray-500">No ZIP codes added yet</p>
            ) : (
              zipcodes.map((zipcode) => (
                <div
                  key={zipcode.id}
                  className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <span>{zipcode.zipcode}</span>
                  <button
                    title="Remove ZIP code"

                    type="button"
                    onClick={() => handleRemoveZipcode(zipcode)}
                    className="text-gray-500 hover:text-red-500"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZipCodeManagement; 