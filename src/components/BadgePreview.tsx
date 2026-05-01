import React from 'react';
import { toast } from 'react-toastify';

interface BadgePreviewProps {
  vendorType: 'VENDOR' | 'RENTAL' | 'SALES';
  vendorId?: number;
  zipcode?: string;
}

const BadgePreview: React.FC<BadgePreviewProps> = ({ vendorType, zipcode }) => {
  // Determine which SVG to show based on vendorType
  const getSvgFile = () => {
    switch (vendorType) {
      case 'RENTAL':
        return `${import.meta.env.VITE_BACKEND_URL}/public/uploads/2.svg`;
      case 'SALES':
        return `${import.meta.env.VITE_BACKEND_URL}/public/uploads/3.svg`;
      case 'VENDOR':
      default:
        return `${import.meta.env.VITE_BACKEND_URL}/public/uploads/1.svg`;
    }
  };

  // Handle badge click - redirect to search with zipcode
  const handleBadgeClick = () => {
    if (zipcode) {
      const searchUrl = `http://localhost:5173/search-vendors?search=${zipcode}`;
      // In a real scenario, this would redirect to the search page
      // For now, show a toast message
      toast.info(`Badge clicked! Would redirect to: ${searchUrl}`);
      
      // You can uncomment this line to actually redirect:
      // window.open(searchUrl, '_blank');
    } else {
      toast.warning('No zipcode available for this vendor');
    }
  };

  return (
    <div
      onClick={handleBadgeClick}
      style={{
        width: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 10px',
        backgroundColor: '#ffffff',
        border: '2px solid #7CB342',
        borderRadius: '6px',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.02)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      }}
    >
      <img
        src={getSvgFile()}
        alt={`${vendorType} Badge`}
        style={{
          width: '110px',
          height: '110px',
          borderRadius: '6px',
          flexShrink: 0,
          objectFit: 'cover',
        }}
      />
    </div>
  );
};

export default BadgePreview;
