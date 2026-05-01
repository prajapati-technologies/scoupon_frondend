import { useState, useEffect } from "react";
import { CheckCircle, Facebook, Globe, Image, Instagram, Linkedin, MapPin, Phone, Pin, Twitter, ChevronLeft, ChevronRight, X, Building2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Gallery } from "../../../ProtectedRouteProps";

// Define the interface for the data structure
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

const VENDORS_PER_PAGE = 12;

const Vendors = ({ vendors }: { vendors: ZipcodeWithUser[] }) => {
    const [filteredVendors, setFilteredVendors] = useState<ZipcodeWithUser[]>([]);
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedVendorGallery, setSelectedVendorGallery] = useState<Gallery[]>([]);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [displayedVendors, setDisplayedVendors] = useState<ZipcodeWithUser[]>([]);

    // Group vendors by userId
    const groupVendorsByUser = (vendorsList: ZipcodeWithUser[]) => {
        const groupedVendors = vendorsList.reduce((acc, current) => {
            const existingVendor = acc.find(v => v.userId === current.userId);
            if (existingVendor) {
                existingVendor.zipcodes = [...(existingVendor.zipcodes || []), current.zipcode];
                return acc;
            }
            return [...acc, { ...current, zipcodes: [current.zipcode] }];
        }, [] as (ZipcodeWithUser & { zipcodes: string[] })[]);
        return groupedVendors;
    };

    useEffect(() => {
        const groupedVendors = groupVendorsByUser(vendors);
        setFilteredVendors(groupedVendors);
        setTotalPages(Math.ceil(groupedVendors.length / VENDORS_PER_PAGE));
    }, [vendors]);

    useEffect(() => {
        const start = (currentPage - 1) * VENDORS_PER_PAGE;
        const end = start + VENDORS_PER_PAGE;
        setDisplayedVendors(filteredVendors.slice(start, end));
    }, [filteredVendors, currentPage]);

    const handleOpenGallery = (gallery: Gallery[]) => {
        if (gallery && gallery.length > 0) {
            setSelectedVendorGallery(gallery);
            setCurrentImageIndex(0);
            setShowGalleryModal(true);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of vendors section
        document.getElementById('vendors-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    // Generate page numbers to display
    const getPageNumbers = () => {
        if (totalPages <= 5) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always show first, last, current, and 1-2 pages around current
        const pages = new Set<number>();
        pages.add(1); // First page
        pages.add(totalPages); // Last page

        // Current and surrounding pages
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.add(i);
        }

        // Convert to sorted array
        const result = Array.from(pages).sort((a, b) => a - b);

        // Add ellipses where needed
        const withEllipses: (number | string)[] = [];
        result.forEach((page, index) => {
            if (index > 0 && page - result[index - 1] > 1) {
                withEllipses.push('...');
            }
            withEllipses.push(page);
        });

        return withEllipses;
    };

    return (
        <section id="vendors-section" className="py-16 bg-gray-50 mt-4">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Vendor Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-12">
                    {displayedVendors && displayedVendors.length > 0 ? (
                        displayedVendors.map((vendorData) => {
                            const vendor = vendorData.user;
                            return (
                                <Card
                                    key={`${vendorData.id}-${vendor.id}`}
                                    className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50 overflow-hidden"
                                >
                                    <CardHeader className="relative p-0">
                                        <div className="w-full h-48 bg-[#a0b830] rounded-t-lg mb-4 overflow-hidden">
                                            <img
                                                src={vendor.companyLogo}
                                                alt={`${vendor.company} Logo`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0  transition-opacity duration-300" />
                                            {vendor.packageActive === "YES" && (
                                                <div className="absolute top-0 right-0 w-[120px] h-[120px] overflow-hidden -mt-1 -mr-1 z-10">
                                                    <div className={`absolute top-[12px] right-[-35px] w-[170px] text-center transform rotate-45 text-white font-medium text-sm py-2 ${
                                                        vendor.vendorType === 'VENDOR' ? 'bg-green-600' :
                                                        vendor.vendorType === 'RENTAL' ? 'bg-blue-600' :
                                                        vendor.vendorType === 'SALES' ? 'bg-red-600' :
                                                        'bg-[#a0b830]'
                                                    }`}>
                                                        {vendor.vendorType}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            <CardTitle className="text-xl font-bold bg-[#a0b830] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                                                {vendor.company}
                                            </CardTitle>
                                            <CardDescription className="text-gray-600 mt-2 grid lg:grid-cols-1 sm:grid-cols-1 gap-2">
                                                {vendor.about && (
                                                    <div className="ml-2 text-sm flex items-center">
                                                        <Building2 className="w-4 h-4 mr-2 text-gray-400" />
                                                        {vendor.about}
                                                    </div>
                                                )}
                                                <div className="ml-2 text-sm flex items-center">
                                                    <Pin className="w-4 h-4 mr-2 text-gray-400" />
                                                    {vendor.address}
                                                </div>
                                                <div className="ml-2 text-sm flex items-center">
                                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                    Zipcodes: {vendorData.zipcodes?.join(", ")}
                                                </div>
                                            </CardDescription>
                                            <CardDescription className="text-gray-600 mt-2 flex items-center">
                                                <div className="ml-2 text-sm flex items-center">
                                                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                    {vendor.city}, {vendor.country}
                                                </div>
                                            </CardDescription>
                                            {vendor.phone && (
                                                <div className="ml-2 mt-2 text-sm flex items-center">
                                                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                    {vendor.phone}
                                                </div>
                                            )}

                                        </div>
                                    </CardHeader>
                                    {vendor.webUrl && (

                                        <div className="flex items-center px-6 py-4 bg-gray-50 border-t">
                                            <a href={vendor.webUrl} target="_blank" className="flex flex-row items-center  cursor-pointer text-blue-500 hover:underline">
                                                <Globe className="w-4 h-4 mr-2 text-gray-400" />
                                                {vendor.webUrl}
                                            </a>
                                        </div>

                                    )}
                                    <CardContent className="p-6 pt-0">
                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center justify-between text-gray-600">
                                                <div className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                                    <span className="text-sm">Verified Business</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Button variant="outline" onClick={() => handleOpenGallery(vendor.gallery)} className="border-gray-300 hover:border-gray-400 hover:bg-gray-100">
                                                        <Image className="w-4 h-4 mr-2 text-gray-400" />
                                                        <span className="text-sm">Gallery</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {vendor.fb && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                                                    onClick={() => window.open(vendor.fb, '_blank')}
                                                >
                                                    <Facebook className="w-4 h-4 text-[#1877F2]" />
                                                </Button>
                                            )}
                                            {vendor.yt && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                                                    onClick={() => window.open(vendor.yt, '_blank')}
                                                >
                                                    <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                                                </Button>
                                            )}
                                            {vendor.in && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                                                    onClick={() => window.open(vendor.in, '_blank')}
                                                >
                                                    <Instagram className="w-4 h-4 text-[#E4405F]" />
                                                </Button>
                                            )}
                                            {vendor.ln && (
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                                                    onClick={() => window.open(vendor.ln, '_blank')}
                                                >
                                                    <Linkedin className="w-4 h-4 text-[#0077B5]" />
                                                </Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-8">
                            <p className="text-gray-500">No vendors found matching your search criteria.</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filteredVendors.length > VENDORS_PER_PAGE && (
                    <div className="mt-10 flex justify-center">
                        <div className="inline-flex shadow-lg rounded-lg overflow-hidden bg-white">
                            {/* Previous page button */}
                            <Button
                                variant="ghost"
                                className={`px-4 py-2 ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>

                            {/* Page numbers */}
                            <div className="hidden sm:flex">
                                {getPageNumbers().map((page, index) => (
                                    typeof page === 'number' ? (
                                        <Button
                                            key={index}
                                            variant={currentPage === page ? "default" : "ghost"}
                                            className={`px-4 py-2 ${currentPage === page
                                                ? 'bg-[#a0b830] text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                                } min-w-10 flex items-center justify-center`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </Button>
                                    ) : (
                                        <span key={index} className="px-3 py-2 flex items-center justify-center text-gray-500">
                                            {page}
                                        </span>
                                    )
                                ))}
                            </div>

                            {/* Mobile view - current page / total pages */}
                            <div className="flex sm:hidden items-center px-4">
                                <span className="text-gray-700">
                                    {currentPage} / {totalPages}
                                </span>
                            </div>

                            {/* Next page button */}
                            <Button
                                variant="ghost"
                                className={`px-4 py-2 ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Gallery Modal */}
            {showGalleryModal && selectedVendorGallery.length > 0 && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowGalleryModal(false)}
                >
                    <div
                        className="relative max-w-4xl w-full  bg-[#a0b830] p-2 rounded-lg"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <Button
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 z-50"
                            onClick={() => setShowGalleryModal(false)}
                        >
                            <X className="w-6 h-6" />
                        </Button>

                        {/* Image slider */}
                        <div className="relative">
                            <div className="overflow-hidden">
                                <div
                                    className="flex transition-transform duration-500 ease-out"
                                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                                >
                                    {selectedVendorGallery.map((image, index) => (
                                        <div
                                            key={image.id}
                                            className="w-full flex-shrink-0"
                                        >
                                            <img
                                                src={image.image}
                                                alt={`Gallery ${index + 1}`}
                                                className="w-full h-[70vh] object-contain"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation arrows */}
                            {selectedVendorGallery.length > 1 && (
                                <>
                                    <Button
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(prev =>
                                                prev === 0 ? selectedVendorGallery.length - 1 : prev - 1
                                            );
                                        }}
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </Button>
                                    <Button
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(prev =>
                                                prev === selectedVendorGallery.length - 1 ? 0 : prev + 1
                                            );
                                        }}
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </Button>
                                </>
                            )}

                            {/* Dots navigation */}
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                {selectedVendorGallery.map((_, index) => (
                                    <Button
                                        key={index}
                                        className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === index ? 'bg-white w-4' : 'bg-white/50'
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentImageIndex(index);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Vendors;