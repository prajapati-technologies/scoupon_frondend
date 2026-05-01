import { User, Zipcode, Gallery } from '../../ProtectedRouteProps';
import { Building2, MapPin, Mail, Phone, Package, Image, ChevronLeft, ChevronRight, X, Trash, Badge } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import CardInfoItem from '../../CardInfoItem';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export interface UserProfile extends Omit<User, 'zipcodes' | 'packageActive'> {
  zipcodes: Zipcode[];
  packageActive?: string;
  gallery?: Gallery[];
}

interface UserProfileCardProps {
  user: UserProfile;
  onCompleteProfile: () => void;
  refreshUserData: () => void;
}

const UserProfileCard = ({ user, onCompleteProfile, refreshUserData }: UserProfileCardProps) => {
  const isProfileComplete = user.company && user.businessName && user.address;
  const isPackageActive = user.packageActive === 'YES';

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
 

  const nextSlide = () => {
    if (user.gallery && currentIndex < user.gallery.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleDeleteImage = async (imageId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/gallery/${imageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.success('Image deleted successfully');
      refreshUserData();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    } 
  };



  if (!isPackageActive) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto">
        <div className="text-center py-8">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            No Active Package
          </h2>
          <p className="text-gray-600 mb-6">
            Please subscribe to a package to access all features
          </p>
          <Link to="/vendor/subscriptions">
            <Button className="bg-[#a0b830] hover:bg-[#8fa029] text-white">
              View Subscription Plans
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          {user.companyLogo ? (
            <img 
              src={user.companyLogo} 
              alt="Company Logo" 
              className="w-16 h-16 rounded-full object-cover border-2 border-[#a0b830]"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
            <div className="flex items-center text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{user.email}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          {!isProfileComplete && (
            <Button 
              onClick={onCompleteProfile}
              className="bg-[#a0b830] hover:bg-[#8fa029] text-white"
            >
              Update Profile
            </Button>
          )}
          <Link to="/vendor/add/gallery">
            <Button className="bg-[#a0b830] hover:bg-[#8fa029] text-white">Add Gallery</Button>
          </Link>
        </div>
      </div>

      {/* Company Details Section */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Building2 className="w-5 h-5 mr-2 text-[#a0b830]" />
          Company Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardInfoItem label="Business Name" value={user.businessName} />
          <CardInfoItem label="Company" value={user.company} />
          <CardInfoItem label="Phone" value={user.phone} icon={Phone} />
          <CardInfoItem label="Address" value={user.address} icon={MapPin} />
          <CardInfoItem label="City" value={user.city} />
          <CardInfoItem label="State" value={user.state} />
          <CardInfoItem label="Country" value={user.country} />
        </div>
      </div>

      {/* Certified Vendor Badge Section - Only show if user has zipcodes */}
      {user.zipcodes.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Badge className="w-5 h-5 mr-2 text-[#a0b830]" />
              Certified Vendor Badge
            </h3>
            <Link to="/vendor/certification-badge">
              <Button size="sm" className="bg-[#a0b830] hover:bg-[#8fa029] text-white">
                Customize Badge
              </Button>
            </Link>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Display your certified vendor status on your website with our professional badge. 
            This badge shows visitors that you are a verified and trusted vendor partner.
          </p>
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#a0b830] to-[#8fa029] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CA</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Certified Vendor</div>
                  <div className="text-sm text-gray-600">{user.company || user.name}</div>
                </div>
              </div>
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                ✓ Verified
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zipcodes Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-[#a0b830]" />
            Service Areas
          </h3>
          <span className="text-sm text-gray-600">
            {user.zipcodes.length} ZIP codes added
          </span>
        </div>
        {user.zipcodes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.zipcodes.map((zipcode) => (
              <span 
                key={zipcode.id} 
                className="bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200 hover:border-[#a0b830] transition-colors"
              >
                {zipcode.zipcode}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No ZIP codes added yet</p>
        )}
      </div>
     
      {/* Gallery Section */}
      {user.gallery && user.gallery.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 mt-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Image className="w-5 h-5 mr-2 text-[#a0b830]" />
            Gallery
          </h3>
          
          <div className="relative">
            {/* Gallery Container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {user.gallery.map((image: GalleryImage, index: number) => (
                  <div 
                    key={image.id} 
                    className="flex-shrink-0 w-[200px] h-[150px] mx-2"
                    onClick={() => setSelectedImage(image.image)}
                  >
                    <div className="relative flex justify-end">
                    <Button variant="ghost" size="icon" className=" bg-gray-300/90 hover:bg-red-700/90 rounded-full p-1 cursor-pointer" onClick={(e) => handleDeleteImage(image.id, e)}>
                      <Trash className="w-4 h-4 mr-2 text-white" />
                    </Button>
                    </div>
                    <img 
                      src={image.image} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            {user.gallery.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  className={`absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 ${
                    currentIndex === 0 ? 'invisible' : ''
                  }`}
                  onClick={prevSlide}
                >
                  <ChevronLeft className="w-6 h-6 text-gray-800" />
                </Button>

                <Button
                  variant="ghost"
                  className={`absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white/90 rounded-full p-2 ${
                    currentIndex >= user.gallery.length - 1 ? 'invisible' : ''
                  }`}
                  onClick={nextSlide}
                >
                  <ChevronRight className="w-6 h-6 text-gray-800" />
                </Button>
              </>
            )}
          </div>

          {/* Image Modal */}
          {selectedImage && (
            <ImageModal 
              image={selectedImage} 
              onClose={() => setSelectedImage(null)} 
            />
          )}
        </div>
      )}

       {/* Package Status */}
       <div className="mt-6 text-center mb-1">
        <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium">
          <Package className="w-4 h-4 mr-2" />
          Active Package
        </span>
      </div>
    </div>
  );
};

interface GalleryImage {
  id: number;
  image: string;
}

const ImageModal = ({ image, onClose }: { image: string; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
    <div className="relative max-w-4xl max-h-[90vh] mx-4">
      <img src={image} alt="Gallery" className="max-w-full max-h-[85vh] object-contain" />
      <button 
        title="Close"

        className="absolute top-4 right-4 text-white hover:text-gray-300"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </button>
    </div>
  </div>
);

export default UserProfileCard;