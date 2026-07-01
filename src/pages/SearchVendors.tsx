import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapPin, Phone, ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Header from "./components/home/Header";
import Footer from "./components/home/Footer";
import { Helmet } from "react-helmet-async";

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

const VENDORS_PER_PAGE = 6;

const SearchVendors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [zipcodeResults, setZipcodeResults] = useState<ZipcodeWithUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const searchQuery = searchParams.get("search");

  const generateSlug = (company: string, name: string, id: number) => {
    const text = (company || name || "vendor").toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    return `${text}-${id}`;
  };

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/zipcode/search/profile`, {
          params: { zipcode: searchQuery },
        });
        setZipcodeResults(response.data);
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

  const handleSearch = () => {
    if (searchInput.trim()) {
      setSearchParams({ search: searchInput.trim() });
      setCurrentPage(1);
    }
  };

  // Pagination
  const totalPages = Math.ceil(zipcodeResults.length / VENDORS_PER_PAGE);
  const paginatedVendors = useMemo(() => {
    const start = (currentPage - 1) * VENDORS_PER_PAGE;
    return zipcodeResults.slice(start, start + VENDORS_PER_PAGE);
  }, [zipcodeResults, currentPage]);

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
        <title>Search Vendors - Core Aeration</title>
        <meta name="description" content="Search for aeration vendors by ZIP code in your area." />
      </Helmet>
      <Header />

      {/* Hero Section */}
      <section
        className="relative pt-16 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/aeration-hero.png')` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32">
          <h1 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-white leading-tight mb-3">
            Search Aeration<br />Vendors Near You
          </h1>
          <p className="text-base md:text-lg text-gray-100">
            Enter your ZIP code to find vendors in your area.
          </p>
        </div>
      </section>

      {/* Search Form */}
      <section className="relative z-20 -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Search by ZIP Code</h2>
            <p className="text-sm text-gray-500 mb-6">
              Enter a ZIP / Postal code to find aeration vendors in that area.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-800 mb-1.5">ZIP / Postal Code</label>
              <Input
                type="text"
                placeholder="Enter your ZIP code..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full bg-white border-gray-300 h-11 max-w-md"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <button
              onClick={handleSearch}
              className="w-full bg-[#1a5c1a] hover:bg-[#145214] text-white font-bold py-4 rounded-md text-base uppercase tracking-wider transition-colors duration-200"
            >
              SEARCH VENDORS
            </button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="w-full mt-12 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            {searchQuery ? `Vendors in ${searchQuery}` : "Search Results"}
          </h2>

          {/* View toggle */}
          {zipcodeResults.length > 0 && (
            <div className="flex items-center gap-3 mb-6">
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
          )}

          {/* Content */}
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
                    return (
                      <div
                        key={vendorData.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                      >
                        <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                          {vendor.companyLogo ? (
                            <img src={vendor.companyLogo} alt={vendor.company} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-green-100 flex items-center justify-center">
                              <span className="text-green-700 text-xs font-bold">{vendor.company?.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-gray-900 truncate">{vendor.company || vendor.name}</h3>
                          <p className="text-sm text-gray-600 truncate">
                            {vendor.vendorType === "RENTAL" ? "Aeration Equipment Rentals"
                              : vendor.vendorType === "SALES" ? "Equipment Sales, Parts & Supplies"
                              : "Aeration Services"}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            <span className="truncate">{[vendor.city, vendor.state, vendorData.zipcode].filter(Boolean).join(", ")}</span>
                          </div>
                          {vendor.phone && (
                            <div className="flex items-center text-sm text-gray-500 mt-0.5">
                              <Phone className="w-3.5 h-3.5 mr-1" />
                              {vendor.phone}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-sm border-gray-300 h-9 px-4"
                            onClick={() => navigate(`/vendor/${generateSlug(vendor.company, vendor.name, vendor.id)}`)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginatedVendors.map((vendorData) => {
                    const vendor = vendorData.user;
                    return (
                      <div
                        key={vendorData.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="h-40 bg-gray-100">
                          {vendor.companyLogo ? (
                            <img src={vendor.companyLogo} alt={vendor.company} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-green-50 flex items-center justify-center">
                              <span className="text-green-700 text-2xl font-bold">{vendor.company?.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-base font-bold text-gray-900 truncate">{vendor.company || vendor.name}</h3>
                          <p className="text-sm text-gray-500 mt-1 truncate">
                            {[vendor.city, vendor.state, vendorData.zipcode].filter(Boolean).join(", ")}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs h-8"
                              onClick={() => navigate(`/vendor/${generateSlug(vendor.company, vendor.name, vendor.id)}`)}
                            >
                              View Profile
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 text-xs h-8 bg-[#1a5c1a] hover:bg-[#145214] text-white"
                              onClick={() => window.open(`tel:${vendor.phone}`, '_self')}
                            >
                              Contact
                            </Button>
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
                    {Math.min(currentPage * VENDORS_PER_PAGE, zipcodeResults.length)} of{" "}
                    {zipcodeResults.length} vendors
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
                            currentPage === page ? "bg-[#1a5c1a] text-white hover:bg-[#145214]" : "text-gray-700"
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
          ) : searchQuery ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No vendors found for ZIP code "{searchQuery}".</p>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500">Enter a ZIP code to search for vendors.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SearchVendors;
