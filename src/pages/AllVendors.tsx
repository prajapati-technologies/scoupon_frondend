import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "./components/home/Footer";
import Header from "./components/home/Header";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { Gallery } from "../ProtectedRouteProps";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Filter, LayoutGrid, List, MapPin, Phone, ChevronLeft, ChevronRight, Crown } from "lucide-react";
import { Button } from "../components/ui/button";
import { useAuth } from "../useAuth";

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

// Define the flattened structure
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

// Grouped vendor type
interface GroupedVendor extends ZipcodeWithUser {
  zipcodes: string[];
}

const VENDORS_PER_PAGE = 6;

// Premium ad interface
interface PremiumAdData {
  id: number;
  row: number;
  position: number;
  user: {
    id: number;
    name: string;
    company: string;
    companyLogo: string;
    vendorType: string;
    city: string;
    state: string;
    phone: string;
    about: string;
  };
}

const AllVendors = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const { isAuthenticated } = useAuth();
  const [vendors, setVendors] = useState<ZipcodeWithUser[]>([]);
  const [premiumAds, setPremiumAds] = useState<PremiumAdData[]>([]);
  const [cityName, setCityName] = useState("");
  const [cityState, setCityState] = useState("");

  // Generate SEO-friendly slug from company name + id
  const generateSlug = (company: string, name: string, id: number) => {
    const text = (company || name || "vendor").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `${text}-${id}`;
  };
  const [loading, setLoading] = useState(false);

  // Search form state
  const [zipCode, setZipCode] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get unique zipcodes for suggestions
  const zipcodeSuggestions = useMemo(() => {
    if (!zipCode.trim() || zipCode.trim().length < 1) return [];
    const unique = [...new Set(vendors.map((v) => v.zipcode))];
    return unique
      .filter((z) => z.toLowerCase().includes(zipCode.trim().toLowerCase()))
      .slice(0, 8);
  }, [vendors, zipCode]);

  // Listing state
  const [businessTypeFilter, setBusinessTypeFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  // Function to flatten the API response
  const flattenApiResponse = (apiData: ApiResponse[]): ZipcodeWithUser[] => {
    const flattened: ZipcodeWithUser[] = [];

    apiData.forEach((subscribePackage) => {
      subscribePackage.zipCodes.forEach((zc) => {
        const gallery: Gallery[] = zc.user.gallery.map((g) => ({
          id: g.id,
          image: g.image,
          userId: g.userId,
          createdAt: g.createdAt,
          updatedAt: g.updatedAt,
        }));

        flattened.push({
          id: zc.id,
          zipcode: zc.zipcode,
          userId: zc.userId,
          createdAt: zc.createdAt,
          updatedAt: zc.updatedAt,
          user: {
            ...zc.user,
            gallery: gallery,
          },
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
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/zipcode/all/profile`
        );
        const flattenedVendors = flattenApiResponse(response.data);
        setVendors(flattenedVendors);
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPremiumAds = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/premium-ad/approved`
        );
        setPremiumAds(response.data);
      } catch (error) {
        console.error("Failed to fetch premium ads:", error);
      }
    };

    fetchVendors();
    fetchPremiumAds();
  }, []);

  // Fetch vendors by city when slug is present
  useEffect(() => {
    if (!slug) {
      setCityName("");
      setCityState("");
      return;
    }

    const fetchCityVendors = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/zipcode/city/${slug}`
        );
        if (response.data.city) {
          setCityName(response.data.city);
          setCityState(response.data.state || "");
          // Set vendors from city response (transform to match ZipcodeWithUser format)
          const cityVendors: ZipcodeWithUser[] = response.data.vendors.map((zc: any) => ({
            id: zc.id,
            zipcode: zc.zipcode,
            userId: zc.userId,
            createdAt: zc.createdAt,
            updatedAt: zc.updatedAt,
            user: {
              ...zc.user,
              gallery: zc.user.gallery || [],
            },
          }));
          setVendors(cityVendors);
        }
      } catch (error) {
        console.error("Failed to fetch city vendors:", error);
      }
    };

    fetchCityVendors();
  }, [slug]);

  // Filter vendors based on zipcode search (only when no slug)
  const searchFilteredVendors = useMemo(() => {
    let filtered = vendors;

    if (!slug && zipCode.trim()) {
      filtered = filtered.filter((v) =>
        v.zipcode.toLowerCase().includes(zipCode.trim().toLowerCase())
      );
    }

    return filtered;
  }, [vendors, zipCode, slug]);

  // Group vendors by userId
  const groupedVendors = useMemo(() => {
    const grouped: GroupedVendor[] = [];
    searchFilteredVendors.forEach((current) => {
      const existing = grouped.find((v) => v.userId === current.userId);
      if (existing) {
        existing.zipcodes = [...(existing.zipcodes || []), current.zipcode];
      } else {
        grouped.push({ ...current, zipcodes: [current.zipcode] });
      }
    });
    return grouped;
  }, [searchFilteredVendors]);

  // Apply business type filter and sort premium vendors to top
  const finalVendors = useMemo(() => {
    let filtered = groupedVendors;
    if (businessTypeFilter !== "all") {
      filtered = filtered.filter(
        (v) => v.user.vendorType === businessTypeFilter
      );
    }
    // Sort: premium vendors first (by row then position), then others
    const premiumUserIds = new Set(premiumAds.map((a) => a.user.id));
    const sorted = [...filtered].sort((a, b) => {
      const aIsPremium = premiumUserIds.has(a.userId);
      const bIsPremium = premiumUserIds.has(b.userId);
      if (aIsPremium && !bIsPremium) return -1;
      if (!aIsPremium && bIsPremium) return 1;
      if (aIsPremium && bIsPremium) {
        const adA = premiumAds.find((ad) => ad.user.id === a.userId);
        const adB = premiumAds.find((ad) => ad.user.id === b.userId);
        if (adA && adB) {
          if (adA.row !== adB.row) return adA.row - adB.row;
          return adA.position - adB.position;
        }
      }
      return 0;
    });
    return sorted;
  }, [groupedVendors, businessTypeFilter, premiumAds]);

  // Pagination
  const totalPages = Math.ceil(finalVendors.length / VENDORS_PER_PAGE);
  const paginatedVendors = useMemo(() => {
    const start = (currentPage - 1) * VENDORS_PER_PAGE;
    return finalVendors.slice(start, start + VENDORS_PER_PAGE);
  }, [finalVendors, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [zipCode, businessTypeFilter]);

  const handleFindVendors = async () => {
    if (!zipCode.trim()) {
      const resultsSection = document.getElementById("vendors-results");
      if (resultsSection) resultsSection.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Detect city from pincode using free API
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode.trim()}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.places && data.places.length > 0) {
          const city = data.places[0]["place name"];
          const citySlug = city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          navigate(`/all-vendors/${citySlug}`);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to detect city:", error);
    }

    // Fallback: just scroll to results
    const resultsSection = document.getElementById("vendors-results");
    if (resultsSection) resultsSection.scrollIntoView({ behavior: "smooth" });
  };

  // Build browse heading
  const browseHeading = useMemo(() => {
    if (slug && cityName) return `Browse Vendors in ${cityName}${cityState ? `, ${cityState}` : ""}`;
    if (zipCode.trim()) return `Browse Vendors in ${zipCode.trim()}`;
    return "Browse All Vendors";
  }, [zipCode, slug, cityName, cityState]);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | string)[] = [];
    for (let i = 1; i <= Math.min(4, totalPages); i++) {
      pages.push(i);
    }
    if (totalPages > 5) pages.push("...");
    if (totalPages > 4) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Find All Local Aeration Vendors in Your Area</title>
        <meta
          name="description"
          content="View the complete list of core aeration vendors listed in our USA directory. Search by state or city to find a professional lawn aeration company near you today."
        />
      </Helmet>
      <Header />

      {/* Hero Section with background image */}
      <section
        className="relative pt-16 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/aeration-hero.png')` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32">
          <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-tight mb-3">
            Find Local Aeration<br />Experts & Equipment
          </h1>
          <p className="text-base md:text-lg text-gray-100">
            Search by location to find vendors, rental<br className="hidden sm:block" />
            companies and sales in your area.
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="relative z-20 -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Find in Your Area</h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter your ZIP / Postal code to find aeration professionals near you.
            </p>

            {/* ZIP Code */}
            <div className="mb-6 relative">
              <label className="block text-sm font-bold text-gray-800 mb-1.5">ZIP / Postal Code</label>
              <Input
                type="text"
                placeholder="Enter your ZIP code..."
                value={zipCode}
                onChange={(e) => { setZipCode(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full bg-white border-gray-300 h-11 max-w-md"
                onKeyDown={(e) => e.key === "Enter" && handleFindVendors()}
              />
              {/* Suggestions Dropdown */}
              {showSuggestions && zipcodeSuggestions.length > 0 && (
                <div className="absolute z-30 mt-1 w-full max-w-md bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {zipcodeSuggestions.map((zip) => (
                    <button
                      key={zip}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-[#1a5c1a] transition-colors"
                      onMouseDown={() => { setZipCode(zip); setShowSuggestions(false); }}
                    >
                      {zip}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleFindVendors}
              className="w-full bg-[#1a5c1a] hover:bg-[#145214] text-white font-bold py-4 rounded-md text-base uppercase tracking-wider transition-colors duration-200"
            >
              FIND VENDORS
            </button>
          </div>
        </div>
      </section>

      {/* Vendors Results Section */}
      <section id="vendors-results" className="w-full mt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Browse Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">{browseHeading}</h2>

        {/* Premium Ad Spots - Static Section */}
        <div className="mb-8">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-900">
              Premium Ad Spots <span className="text-sm font-normal text-gray-500">(Purchased Ads First)</span>
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Purchased ads always appear first. If no ads are purchased, auto ads will show as "Be the First" or "Next".
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Spot 1 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#1a5c1a] text-white rounded-full flex items-center justify-center text-xs font-bold shadow">
                1
              </div>
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="30" width="40" height="28" rx="2" stroke="#2d6a2d" strokeWidth="2.5" fill="#f0fdf4"/>
                  <rect x="26" y="42" width="12" height="16" rx="1" stroke="#2d6a2d" strokeWidth="2" fill="white"/>
                  <path d="M8 30L32 14L56 30" stroke="#2d6a2d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="20" y1="36" x2="20" y2="24" stroke="#2d6a2d" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="44" y1="36" x2="44" y2="24" stroke="#2d6a2d" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Be the First Vendor<br/>in Your Area</h4>
              <p className="text-xs text-gray-500 mb-3">Your business can be the first one here!</p>
              <Button
                size="sm"
                className="bg-[#1a5c1a] hover:bg-[#145214] text-white text-xs px-4"
                onClick={() => navigate(isAuthenticated ? "/vendor/premium-ads" : "/login")}
              >
                Claim This Spot
              </Button>
            </div>

            {/* Spot 2 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#1a5c1a] text-white rounded-full flex items-center justify-center text-xs font-bold shadow">
                2
              </div>
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="28" width="36" height="22" rx="3" stroke="#2d6a2d" strokeWidth="2.5" fill="#f0fdf4"/>
                  <rect x="44" y="32" width="14" height="18" rx="2" stroke="#2d6a2d" strokeWidth="2" fill="white"/>
                  <circle cx="18" cy="54" r="5" stroke="#2d6a2d" strokeWidth="2.5" fill="white"/>
                  <circle cx="36" cy="54" r="5" stroke="#2d6a2d" strokeWidth="2.5" fill="white"/>
                  <rect x="14" y="34" width="8" height="6" rx="1" fill="#2d6a2d" opacity="0.3"/>
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Rental Company<br/>Spot</h4>
              <p className="text-xs text-gray-500 mb-3">Promote your rental business here.</p>
              <Button
                size="sm"
                className="bg-[#1a5c1a] hover:bg-[#145214] text-white text-xs px-4"
                onClick={() => navigate(isAuthenticated ? "/vendor/premium-ads" : "/login")}
              >
                Claim This Spot
              </Button>
            </div>

            {/* Spot 3 */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-[#1a5c1a] text-white rounded-full flex items-center justify-center text-xs font-bold shadow">
                3
              </div>
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32 8L38 20H26L32 8Z" stroke="#2d6a2d" strokeWidth="2" fill="#f0fdf4"/>
                  <rect x="22" y="20" width="20" height="36" rx="3" stroke="#2d6a2d" strokeWidth="2.5" fill="#f0fdf4"/>
                  <line x1="22" y1="30" x2="42" y2="30" stroke="#2d6a2d" strokeWidth="1.5"/>
                  <line x1="22" y1="38" x2="42" y2="38" stroke="#2d6a2d" strokeWidth="1.5"/>
                  <circle cx="44" cy="12" r="6" stroke="#2d6a2d" strokeWidth="2" fill="#f0fdf4"/>
                  <path d="M42 12L43.5 13.5L46.5 10.5" stroke="#2d6a2d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Sales Company<br/>Spot</h4>
              <p className="text-xs text-gray-500 mb-3">Promote your sales business here.</p>
              <Button
                size="sm"
                className="bg-[#1a5c1a] hover:bg-[#145214] text-white text-xs px-4"
                onClick={() => navigate(isAuthenticated ? "/vendor/premium-ads" : "/login")}
              >
                Claim This Spot
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
            <SelectTrigger className="w-[180px] border-gray-300 h-10 text-sm">
              <SelectValue placeholder="All Business Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Business Types</SelectItem>
              <SelectItem value="VENDOR">Vendor Services</SelectItem>
              <SelectItem value="RENTAL">Equipment Rental</SelectItem>
              <SelectItem value="SALES">Equipment Sales</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="default"
            className="bg-[#1a5c1a] hover:bg-[#145214] text-white h-10 px-4 text-sm"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          {/* View toggle */}
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              className={`h-9 w-9 ${viewMode === "grid" ? "bg-gray-200 text-gray-900" : "text-gray-500"}`}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-5 h-5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              className={`h-9 w-9 ${viewMode === "list" ? "bg-gray-200 text-gray-900" : "text-gray-500"}`}
              onClick={() => setViewMode("list")}
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content: Sidebar + Vendors */}
        <div className="flex gap-8">
          {/* Business Types Sidebar */}
          <aside className="hidden lg:block w-[200px] flex-shrink-0">
            <div className="bg-[#1a5c1a] text-white font-bold px-4 py-2.5 rounded-t-md text-sm">
              Business Types
            </div>
            <div className="border border-t-0 border-gray-200 rounded-b-md">
              <button
                onClick={() => setBusinessTypeFilter("all")}
                className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                  businessTypeFilter === "all" ? "font-semibold text-[#1a5c1a] bg-green-50" : "text-gray-700"
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setBusinessTypeFilter("VENDOR")}
                className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                  businessTypeFilter === "VENDOR" ? "font-semibold text-[#1a5c1a] bg-green-50" : "text-gray-700"
                }`}
              >
                Vendor Services
              </button>
              <button
                onClick={() => setBusinessTypeFilter("RENTAL")}
                className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                  businessTypeFilter === "RENTAL" ? "font-semibold text-[#1a5c1a] bg-green-50" : "text-gray-700"
                }`}
              >
                Equipment Rental
              </button>
              <button
                onClick={() => setBusinessTypeFilter("SALES")}
                className={`w-full text-left px-4 py-2.5 text-sm border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50 ${
                  businessTypeFilter === "SALES" ? "font-semibold text-[#1a5c1a] bg-green-50" : "text-gray-700"
                }`}
              >
                Equipment Sales
              </button>
            </div>
          </aside>

          {/* Vendors List */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <p className="text-gray-500">Loading vendors...</p>
              </div>
            ) : paginatedVendors.length > 0 ? (
              <>
                {viewMode === "list" ? (
                  <div className="space-y-4">
                    {paginatedVendors.map((vendorData) => {
                      const vendor = vendorData.user;
                      const isPremium = premiumAds.some((a) => a.user.id === vendor.id);
                      return (
                        <div
                          key={`${vendorData.id}-${vendor.id}`}
                          className={`bg-white border rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow ${isPremium ? "border-2 border-[#1a5c1a]" : "border-gray-200"}`}
                        >
                          {/* Logo */}
                          <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                            {vendor.companyLogo ? (
                              <img
                                src={vendor.companyLogo}
                                alt={vendor.company}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-green-100 flex items-center justify-center">
                                <span className="text-green-700 text-xs font-bold">{vendor.company?.charAt(0)}</span>
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-bold text-gray-900 truncate">
                                {vendor.company || vendor.name}
                              </h3>
                              {isPremium && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-700 border border-yellow-300 flex-shrink-0">
                                  <Crown className="w-3 h-3" /> PREMIUM
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {vendor.vendorType === "RENTAL"
                                ? "Aeration Equipment Rentals"
                                : vendor.vendorType === "SALES"
                                ? "Equipment Sales, Parts & Supplies"
                                : "Aeration Services"}
                              {vendor.about && `, ${vendor.about}`}
                            </p>
                            <div className="flex items-center text-sm text-gray-500 mt-0.5">
                              <MapPin className="w-3.5 h-3.5 mr-1" />
                              <span className="truncate">
                                {[vendor.city, vendor.state, vendorData.zipcodes?.[0]].filter(Boolean).join(", ")}
                              </span>
                            </div>
                            {vendor.phone && (
                              <div className="flex items-center text-sm text-gray-500 mt-0.5">
                                <Phone className="w-3.5 h-3.5 mr-1" />
                                {vendor.phone}
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-sm border-gray-300 h-9 px-4"
                              onClick={() => navigate(`/vendors/${generateSlug(vendor.company, vendor.name, vendor.id)}`)}
                            >
                              View Profile
                            </Button>
                            <Button
                              size="sm"
                              className="text-sm bg-[#1a5c1a] hover:bg-[#145214] text-white h-9 px-4"
                              onClick={() => window.open(`tel:${vendor.phone}`, '_self')}
                            >
                              Contact
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Grid View */
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {paginatedVendors.map((vendorData) => {
                      const vendor = vendorData.user;
                      const isPremium = premiumAds.some((a) => a.user.id === vendor.id);
                      return (
                        <div
                          key={`${vendorData.id}-${vendor.id}`}
                          className={`bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${isPremium ? "border-2 border-[#1a5c1a]" : "border-gray-200"}`}
                        >
                          <div className="h-40 bg-gray-100 relative">
                            {isPremium && (
                              <div className="absolute top-2 right-2 z-10">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-100 text-yellow-700 border border-yellow-300">
                                  <Crown className="w-3 h-3" /> PREMIUM
                                </span>
                              </div>
                            )}
                            {vendor.companyLogo ? (
                              <img
                                src={vendor.companyLogo}
                                alt={vendor.company}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-green-50 flex items-center justify-center">
                                <span className="text-green-700 text-2xl font-bold">{vendor.company?.charAt(0)}</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="text-base font-bold text-gray-900 truncate">{vendor.company || vendor.name}</h3>
                            <p className="text-sm text-gray-500 mt-1 truncate">
                              {[vendor.city, vendor.state, vendorData.zipcodes?.[0]].filter(Boolean).join(", ")}
                            </p>
                            <div className="flex gap-2 mt-3">
                              <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={() => navigate(`/vendors/${generateSlug(vendor.company, vendor.name, vendor.id)}`)}>View Profile</Button>
                              <Button size="sm" className="flex-1 text-xs h-8 bg-[#1a5c1a] hover:bg-[#145214] text-white" onClick={() => window.open(`tel:${vendor.phone}`, '_self')}>Contact</Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-600">
                      Showing {(currentPage - 1) * VENDORS_PER_PAGE + 1} to{" "}
                      {Math.min(currentPage * VENDORS_PER_PAGE, finalVendors.length)} of{" "}
                      {finalVendors.length} vendors
                    </p>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      {getPageNumbers().map((page, idx) =>
                        typeof page === "number" ? (
                          <Button
                            key={idx}
                            variant={currentPage === page ? "default" : "ghost"}
                            size="icon"
                            className={`h-8 w-8 text-sm ${
                              currentPage === page
                                ? "bg-[#1a5c1a] text-white hover:bg-[#145214]"
                                : "text-gray-700"
                            }`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        ) : (
                          <span key={idx} className="px-1 text-gray-400 text-sm">...</span>
                        )
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => p + 1)}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500">No vendors found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllVendors;
