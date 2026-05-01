import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Building2, CheckCircle, Facebook, Globe, Instagram, Linkedin, MapPin, Phone, Pin, Twitter } from "lucide-react";
import { Button } from "../components/ui/button";
import Header from "./components/home/Header";
import Footer from "./components/home/Footer";
import Hero from "./components/home/Hero";

// Define proper type for the API response based on the updated backend
interface ZipcodeWithUser {
    id: string;
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
        vendorType: string;
    };
}

const SearchVendors = () => {
    const [searchParams] = useSearchParams();
    const [zipcodeResults, setZipcodeResults] = useState<ZipcodeWithUser[]>([]);
    const [loading, setLoading] = useState(false);

    const searchQuery = searchParams.get("search");

    useEffect(() => {
        const fetchVendors = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/zipcode/search/profile`, {
                    params: { zipcode: searchQuery },
                });
                setZipcodeResults(response.data);
                console.log("API response:", response.data);
            } catch (error) {
                console.error("Failed to fetch vendors:", error);
            } finally {
                setLoading(false);
            }
        };

        if (searchQuery) {
            fetchVendors();
        }
    }, [searchQuery]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <Hero />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Search Results</h1>
                {loading ? (
                    <p>Loading vendors...</p>
                ) : zipcodeResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {zipcodeResults.map((zipcodeResult) => {
                            const user = zipcodeResult.user;
                            return (
                                <Card
                                    key={zipcodeResult.id}
                                    className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden"
                                >
                                    <CardHeader className="relative p-0">
                                        <div className="w-full h-48 bg-[#a0b830] rounded-t-lg mb-4 overflow-hidden">
                                            <img
                                                src={user.companyLogo}
                                                alt={`${user.company} Logo`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0  transition-opacity duration-300" />
                                                                                         {user.packageActive === "YES" && (
                                                 <div className="absolute top-0 right-0 w-[120px] h-[120px] overflow-hidden -mt-1 -mr-1 z-10">
                                                     <div className={`absolute top-[12px] right-[-35px] w-[170px] text-center transform rotate-45 text-white font-medium text-sm py-2 ${
                                                         user.vendorType === 'VENDOR' ? 'bg-green-600' :
                                                         user.vendorType === 'RENTAL' ? 'bg-blue-600' :
                                                         user.vendorType === 'SALES' ? 'bg-red-600' :
                                                         'bg-[#a0b830]'
                                                     }`}>
                                                         {user.vendorType}
                                                     </div>
                                                 </div>
                                             )}
                                        </div>
                                                                                 <div className="p-6">
                                             {user.company && (
                                                 <CardTitle className="text-xl font-bold bg-[#a0b830] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                                                     {user.company}
                                                 </CardTitle>
                                             )}
                                             <CardDescription className="text-gray-600 mt-2 grid lg:grid-cols-1 sm:grid-cols-1 gap-2">
                                                 {user.about && (
                                                     <div className="ml-2 text-sm flex items-center">
                                                         <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                                         {user.about}
                                                     </div>
                                                 )}
                                                 {user.address ? (
                                                     <div className="ml-2 text-sm flex items-center">
                                                         <Pin className="w-4 h-4 mr-2 text-gray-400" />
                                                         {user.address}, {zipcodeResult.zipcode}
                                                     </div>
                                                 ) : (
                                                     <div className="ml-2 text-sm flex items-center">
                                                         <Pin className="w-4 h-4 mr-2 text-gray-400" />
                                                         {zipcodeResult.zipcode}
                                                     </div>
                                                 )}
                                                 {(user.city || user.country) && (
                                                     <div className="ml-2 text-sm flex items-center">
                                                         <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                         {[user.city, user.country].filter(Boolean).join(', ')}
                                                     </div>
                                                 )}
                                             </CardDescription>
                                             {user.phone && (
                                                 <div className="ml-2 mt-2 text-sm flex items-center">
                                                     <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                     {user.phone}
                                                 </div>
                                             )}
                                         </div>
                                    </CardHeader>
                                    {user.webUrl && (
                                        <div className="flex items-center px-6 py-4 bg-gray-50 border-t">
                                            <a href={user.webUrl} target="_blank" className="flex flex-row items-center  cursor-pointer text-blue-500 hover:underline">
                                                <Globe className="w-4 h-4 mr-2 text-gray-400" />
                                                {user.webUrl}
                                            </a>
                                        </div>
                                    )}
                                    <CardContent className="p-6 pt-0">
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                                <span className="text-sm">Verified Business</span>
                                            </div>
                                        </div>
                                                                                 <div className="flex gap-2">
                                            {user.fb && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                                                    onClick={() => window.open(user.fb, '_blank')}
                                                >
                                                    <Facebook className="w-4 h-4 text-[#1877F2]" />
                                                </Button>
                                            )}
                                            {user.yt && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                                                    onClick={() => window.open(user.yt, '_blank')}
                                                >
                                                    <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                                                </Button>
                                            )}
                                            {user.in && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                                                    onClick={() => window.open(user.in, '_blank')}
                                                >
                                                    <Instagram className="w-4 h-4 text-[#E4405F]" />
                                                </Button>
                                            )}
                                            {user.ln && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                                                    onClick={() => window.open(user.ln, '_blank')}
                                                >
                                                    <Linkedin className="w-4 h-4 text-[#0077B5]" />
                                                </Button>
                                            )}

                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <p>No vendors found for your search.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default SearchVendors;