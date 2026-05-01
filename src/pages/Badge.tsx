import { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import axios from 'axios';

const Badge = () => {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendorData = async () => {
      if (!vendorId) return;
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/vendor/badge/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setVendor(response.data.data);
      } catch (error) {
        console.error('Error fetching vendor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [vendorId]);

  const handleBadgeClick = () => {
    if (vendor?.zipcodes && vendor.zipcodes.length > 0) {
      const zipcode = vendor.zipcodes[0].zipcode;
      const searchUrl = `${window.location.origin}/search-vendors?search=${zipcode}`;
      window.open(searchUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-200 rounded-lg flex items-center justify-center" style={{ width: '200px', height: '60px' }}>
        <div className="text-xs text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="bg-gray-200 rounded-lg flex items-center justify-center" style={{ width: '200px', height: '60px' }}>
        <div className="text-xs text-gray-500">Not found</div>
      </div>
    );
  }

  // Determine SVG file based on vendor type
  const getSvgFile = (vendorType: string) => {
    switch (vendorType) {
      case 'RENTAL':
        return `${import.meta.env.VITE_BACKEND_URL}/public/uploads/2.svg`;
      case 'SALES':
        return `${import.meta.env.VITE_BACKEND_URL}/public/uploads/3.svg`;
      default:
        return `${import.meta.env.VITE_BACKEND_URL}/public/uploads/1.svg`;
    }
  };

  return (
    <div 
      className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all duration-200 flex items-center p-3"
      onClick={handleBadgeClick}
      style={{ 
        width: '200px',
        height: '60px',
        background: 'linear-gradient(135deg, #a0b830 0%, #8fa329 100%)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        gap: '12px'
      }}
    >
      <div className="w-8 h-8 flex-shrink-0">
        <img 
          src={getSvgFile(vendor.vendorType || 'SALES')} 
          alt="Vendor Type" 
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-white text-center flex-1">
        <div className="text-xs font-semibold leading-tight">
          Certified Badge
        </div>
      </div>
    </div>
  );
};

export default Badge;
