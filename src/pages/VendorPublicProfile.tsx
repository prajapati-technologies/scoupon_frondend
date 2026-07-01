import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Header from "./components/home/Header";
import Footer from "./components/home/Footer";
import { Helmet } from "react-helmet-async";
import {
  MapPin,
  Phone,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Building2,
  Mail,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";

interface VendorData {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  about: string;
  address: string;
  city: string;
  state: string;
  country: string;
  companyLogo: string;
  bannerImage: string;
  vendorType: string;
  fb: string;
  ln: string;
  in: string;
  yt: string;
  webUrl: string;
  packageActive: string;
  totalzipcodes: number;
  addedzipcodes: number;
  gallery: {
    id: number;
    image: string;
  }[];
  subscribe_packages: {
    id: number;
    zipCodes: {
      id: number;
      zipcode: string;
    }[];
  }[];
}

const VendorPublicProfile = () => {
  const { id, slug } = useParams<{ id?: string; slug?: string }>();
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Extract ID from slug (last part after the last hyphen) or use id param directly
  const vendorId = id || (slug ? slug.split("-").pop() : "");

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/${vendorId}`
        );
        setVendor(response.data);
      } catch (err) {
        console.error("Failed to fetch vendor:", err);
        setError("Vendor not found");
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) fetchVendor();
  }, [vendorId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-16">
          <Loader2 className="h-8 w-8 animate-spin text-[#1a5c1a]" />
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center pt-16">
          <p className="text-gray-500 text-lg">{error || "Vendor not found"}</p>
          <Link to="/vendors" className="mt-4 text-[#1a5c1a] hover:underline">
            ← Back to All Vendors
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{vendor.company || vendor.name} | Core Aeration</title>
        <meta
          name="description"
          content={`${vendor.company || vendor.name} - ${vendor.about || "Aeration services"} in ${vendor.city}, ${vendor.state}`}
        />
      </Helmet>
      <Header />

      <main className="flex-1 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            to="/vendors"
            className="inline-flex items-center text-sm text-[#1a5c1a] hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to All Vendors
          </Link>

          {/* Profile Header */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* Top Banner */}
            {vendor.bannerImage ? (
              <div className="h-48 md:h-56 overflow-hidden">
                <img src={vendor.bannerImage} alt="Banner" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-32 bg-gradient-to-r from-[#1a5c1a] to-[#2d8a2d]"></div>
            )}

            <div className="px-6 md:px-8 pb-6">
              {/* Logo + Name Row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12">
                <div className="w-24 h-24 rounded-lg border-4 border-white shadow-md bg-white overflow-hidden flex-shrink-0">
                  {vendor.companyLogo ? (
                    <img
                      src={vendor.companyLogo}
                      alt={vendor.company}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-100 flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-green-700" />
                    </div>
                  )}
                </div>
                <div className="flex-1 pt-2 sm:pt-0">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {vendor.company || vendor.name}
                  </h1>
                  <div className="flex items-center gap-3 mt-1">
                    <span
                      className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full text-white ${
                        vendor.vendorType === "VENDOR"
                          ? "bg-green-600"
                          : vendor.vendorType === "RENTAL"
                          ? "bg-blue-600"
                          : "bg-red-600"
                      }`}
                    >
                      {vendor.vendorType === "VENDOR"
                        ? "Vendor Services"
                        : vendor.vendorType === "RENTAL"
                        ? "Equipment Rental"
                        : "Equipment Sales"}
                    </span>
                    {vendor.city && vendor.state && (
                      <span className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {vendor.city}, {vendor.state}
                      </span>
                    )}
                  </div>
                </div>
                {/* Contact Button */}
                <Button
                  className="bg-[#1a5c1a] hover:bg-[#145214] text-white"
                  onClick={() => window.open(`tel:${vendor.phone}`, "_self")}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              {vendor.about && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
                  <p className="text-gray-600 leading-relaxed">{vendor.about}</p>
                </div>
              )}

              {/* Service Areas / Zipcodes */}
              {vendor.subscribe_packages && vendor.subscribe_packages.some(sp => sp.zipCodes.length > 0) && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Service Areas</h2>
                  <div className="flex flex-wrap gap-2">
                    {vendor.subscribe_packages.flatMap(sp => sp.zipCodes).map((zc) => (
                      <span
                        key={zc.id}
                        className="bg-green-50 text-green-800 text-sm font-medium px-3 py-1 rounded-full border border-green-200"
                      >
                        {zc.zipcode}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery */}
              {vendor.gallery && vendor.gallery.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {vendor.gallery.map((img) => (
                      <div
                        key={img.id}
                        className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img
                          src={img.image}
                          alt="Gallery"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Contact & Details */}
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
                <div className="space-y-3">
                  {vendor.name && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span>{vendor.name}</span>
                    </div>
                  )}
                  {vendor.phone && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                      <a href={`tel:${vendor.phone}`} className="hover:text-[#1a5c1a]">
                        {vendor.phone}
                      </a>
                    </div>
                  )}
                  {vendor.email && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                      <a href={`mailto:${vendor.email}`} className="hover:text-[#1a5c1a]">
                        {vendor.email}
                      </a>
                    </div>
                  )}
                  {vendor.webUrl && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Globe className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                      <a
                        href={vendor.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#1a5c1a] truncate"
                      >
                        {vendor.webUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {(vendor.address || vendor.city) && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Address</h2>
                  <div className="text-sm text-gray-600 space-y-1">
                    {vendor.address && <p>{vendor.address}</p>}
                    <p>
                      {[vendor.city, vendor.state].filter(Boolean).join(", ")}
                    </p>
                    {vendor.country && <p>{vendor.country}</p>}
                  </div>
                </div>
              )}

              {/* Social Media */}
              {(vendor.fb || vendor.ln || vendor.in || vendor.yt) && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Social Media</h2>
                  <div className="flex flex-wrap gap-3">
                    {vendor.fb && (
                      <a
                        href={vendor.fb}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#1877F2] border border-gray-200 rounded-lg px-3 py-2"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </a>
                    )}
                    {vendor.ln && (
                      <a
                        href={vendor.ln}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#0077B5] border border-gray-200 rounded-lg px-3 py-2"
                      >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                      </a>
                    )}
                    {vendor.in && (
                      <a
                        href={vendor.in}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#E4405F] border border-gray-200 rounded-lg px-3 py-2"
                      >
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </a>
                    )}
                    {vendor.yt && (
                      <a
                        href={vendor.yt}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#FF0000] border border-gray-200 rounded-lg px-3 py-2"
                      >
                        <Youtube className="w-4 h-4" />
                        YouTube
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VendorPublicProfile;
