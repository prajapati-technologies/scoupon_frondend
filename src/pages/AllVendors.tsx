import { useState, useEffect } from "react";
import Footer from "./components/home/Footer";
import Header from "./components/home/Header";
import Vendors from "./components/home/Vendors";
import axios from "axios";
import Hero from "./components/home/Hero";
import { Helmet } from "react-helmet-async";
import { Gallery } from "../ProtectedRouteProps";

// Define the API response structure
interface ApiResponse {
  id: number;
  status: string;
  zipCodes: {
    id: number;
    zipcode: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    user: {
      id: number;
      name: string;
      email: string;
      phone: string;
      company: string;
      address: string;
      city: string;
      state: string;
      country: string;
      companyLogo: string;
      packageActive: string;
      fb: string;
      in: string;
      ln: string;
      yt: string;
      webUrl: string;
      about: string;
      addedzipcodes: number;
      totalzipcodes: number;
      vendorType: string;
      gallery: {
        id: number;
        image: string;
        userId: number;
        createdAt: Date;
        updatedAt: Date;
      }[];
    };
  }[];
}

// Define the flattened structure that Vendors component expects
interface ZipcodeWithUser {
  id: number;
  zipcode: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  zipcodes?: string[];
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    city: string;
    state: string;
    country: string;
    companyLogo: string;
    packageActive: string;
    fb: string;
    in: string;
    ln: string;
    yt: string;
    webUrl: string;
    about: string;
    addedzipcodes: number;
    totalzipcodes: number;
    gallery: Gallery[];
    vendorType: string;
  };
}

const AllVendors = () => {
  const [vendors, setVendors] = useState<ZipcodeWithUser[]>([]);
  const [loading, setLoading] = useState(false);

  // Function to flatten the API response
  const flattenApiResponse = (apiData: ApiResponse[]): ZipcodeWithUser[] => {
    const flattened: ZipcodeWithUser[] = [];
    
    apiData.forEach(subscribePackage => {
      subscribePackage.zipCodes.forEach(zipCode => {
        // Convert gallery from API format to Gallery type
        const gallery: Gallery[] = zipCode.user.gallery.map(g => ({
          id: g.id,
          image: g.image,
          userId: g.userId,
          createdAt: g.createdAt,
          updatedAt: g.updatedAt
        }));

        flattened.push({
          id: zipCode.id,
          zipcode: zipCode.zipcode,
          userId: zipCode.userId,
          createdAt: zipCode.createdAt,
          updatedAt: zipCode.updatedAt,
          user: {
            ...zipCode.user,
            gallery: gallery
          }
        });
      });
    });
    
    return flattened;
  };

  // Fetch vendors on component mount
  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/zipcode/all/profile`);
        
        // Flatten the nested structure to match what Vendors component expects
        const flattenedVendors = flattenApiResponse(response.data);
        setVendors(flattenedVendors);
        
        console.log("Flattened vendors:", flattenedVendors);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Find All Local Aeration Vendors in Your Area</title>
        <meta name="description" content="View the complete list of core aeration vendors listed in our USA directory. Search by state or city to find a professional lawn aeration company near you today." />
      </Helmet>
      <Header />
      <Hero />
      <h1 className="text-2xl font-bold text-center mt-4">All Vendors</h1>
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Loading vendors...</p>
        </div>
      ) : (
        <Vendors vendors={vendors} />
      )}
      <Footer />
    </div>
  );
};

export default AllVendors;