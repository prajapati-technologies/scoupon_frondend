import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useAuth } from '../../useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { CheckCircle, AlertCircle, XCircle, MapPin } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { PaymentModal } from './PaymentModal';
import { Alert, AlertDescription } from '../../components/ui/alert';
import ZipCodeSelectionModal from './ZipCodeSelectionModal';
import PromoCodeModal from './PromoCodeModal';

interface Package {
  id: number;
  name: string;
  price: number;
  duration: number;
  status: string;
  profiles: number;
  description: string;
}

const Subscription = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState<Package[]>([]);
  const [activePackageId, setActivePackageId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [have, setHave] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedZipcodes, setSelectedZipcodes] = useState<string[]>([]);
  const [extraZipcodes, setExtraZipcodes] = useState<number>(0);
  const [showPromoCodeModal, setShowPromoCodeModal] = useState(false);
  const [showZipCodeSelection, setShowZipCodeSelection] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Handle URL parameters for payment status messages
  const searchParams = new URLSearchParams(location.search);
  const success = searchParams.get('success') === 'true';
  const canceled = searchParams.get('canceled') === 'true';
  const error = searchParams.get('error');

  // Clear URL parameters after displaying status
  useEffect(() => {
    if (success || canceled || error) {
      if (success) {
        toast.success('Payment successful! Your subscription is now active.');
      } else if (canceled) {
        toast.info('Payment was canceled.');
      } else if (error) {
        toast.error('There was an issue with your payment.');
      }

      const timer = setTimeout(() => {
        navigate('/dashboard/subscription', { replace: true });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [success, canceled, error, navigate]);

  useEffect(() => {
    fetchPackages();
    fetchActivePackage();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/packages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setPackages(response.data);
    } catch (error) {
      toast.error('Failed to fetch subscription packages');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivePackage = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/subscribepackage/my/pakcage`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('my packages',response);
      if(response.data.status === 'COMPLETED'){
        setHave(true);
      }
      setActivePackageId(response.data?.packageId || null);
    } catch (error) {
      toast.error('Failed to fetch active package');
    }
  };

  // Step 1: Handle subscribe button click - Open promo code modal
  const handleSubscribeClick = (pkg: Package) => {
    console.log('Subscribe clicked for package:', pkg.name);
    setSelectedPackage(pkg);
    setSelectedZipcodes([]);
    setExtraZipcodes(0);
    setShowPromoCodeModal(true);
    setShowZipCodeSelection(false);
    setShowPaymentModal(false);
  };

  // Step 2: Handle promo code completion - Open ZIP code selection
  const handlePromoCodeComplete = (extraZips: number) => {
    console.log('Promo code processed, extra ZIP codes:', extraZips);
    setExtraZipcodes(extraZips);
    setShowPromoCodeModal(false);
    
    // Small delay to ensure smooth transition between modals
    setTimeout(() => {
      setShowZipCodeSelection(true);
    }, 100);
  };

  // Step 3: Handle ZIP code selection completion - Open payment modal
  const handleZipCodeSelectionComplete = (zipcodes: string[]) => {
    console.log('ZIP codes selected:', zipcodes);
    setSelectedZipcodes(zipcodes);
    setShowZipCodeSelection(false);
    
    // Small delay to ensure smooth transition between modals
    setTimeout(() => {
      setShowPaymentModal(true);
    }, 100);
  };

  // Handle payment modal close
  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
    resetAllStates();
  };

  // Handle ZIP code selection modal close
  const handleZipCodeSelectionClose = () => {
    setShowZipCodeSelection(false);
    resetAllStates();
  };

  // Handle promo code modal close
  const handlePromoCodeModalClose = () => {
    setShowPromoCodeModal(false);
    resetAllStates();
  };

  // Reset all modal states
  const resetAllStates = () => {
    setSelectedPackage(null);
    setSelectedZipcodes([]);
    setExtraZipcodes(0);
    setShowPromoCodeModal(false);
    setShowZipCodeSelection(false);
    setShowPaymentModal(false);
  };

  // Calculate total allowed ZIP codes
  const getTotalZipcodes = () => {
    return selectedPackage ? selectedPackage.profiles + extraZipcodes : 0;
  };

  return (
    <DashboardLayout title="Subscriptions" user={user}>
      <div className="max-w-7xl mx-auto py-6 space-y-8">
        {/* Add current subscription status */}
        {have && (
          <Alert className="bg-blue-50 border-blue-200">
            <CheckCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              You currently have an active subscription (Package ID: {activePackageId})
            </AlertDescription>
          </Alert>
        )}

        {/* Status Alerts */}
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your payment was successful! Your subscription is now active.
            </AlertDescription>
          </Alert>
        )}

        {canceled && (
          <Alert className="bg-yellow-50 border-yellow-200">
            <XCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Your payment was canceled. No charges were made.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert className="bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              There was an error processing your payment. Please try again or contact support.
            </AlertDescription>
          </Alert>
        )}

        <section>
          <h2 className="text-2xl font-bold mb-6">Available Packages</h2>
          {loading ? (
            <div className="text-center py-8">Loading packages...</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`relative overflow-hidden transition-all duration-300 bg-lime-100 hover:shadow-xl hover:scale-105 group border-2 
                    ${pkg.id === activePackageId 
                      ? 'border-green-500' 
                      : 'border-transparent hover:border-[#a0b830]'}`}
                >
                  {/* Add active package indicator */}
                  {pkg.id === activePackageId && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                      Current Plan
                    </div>
                  )}

                  <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-800 dark:to-green-900 border-b pb-4">
                    <CardTitle className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800 dark:text-white">{pkg.name}</span>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6 p-6">
                    {/* Price section with better visual hierarchy */}
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-extrabold text-[#a0b830]">${pkg.price}</span>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
                        /{pkg.duration} <span className="font-semibold">Year</span>{pkg.duration > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Profiles section with icon */}
                    <div className="flex items-center justify-center bg-white dark:bg-gray-800 p-3 rounded-lg">
                      <MapPin className="h-5 w-5 text-[#a0b830] mr-2" />
                      <span className="text-2xl font-bold text-[#a0b830]">{pkg.profiles}</span>
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium">zipcodes</span>
                    </div>

                    {/* Features list with improved styling */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Package Features:</h4>
                      <ul className="space-y-2">
                        {pkg.description.split('\\n').map((line, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Update button section */}
                    <div className="flex justify-center pt-4">
                      <Button
                        className="w-full bg-[#a0b830] hover:bg-[#8fa029]"
                        onClick={() => handleSubscribeClick(pkg)}
                        disabled={showPromoCodeModal || showZipCodeSelection || showPaymentModal}
                      >
                        {selectedPackage?.id === pkg.id && (showPromoCodeModal || showZipCodeSelection || showPaymentModal) 
                          ? 'Processing...' 
                          : 'Subscribe Now'
                        }
                      </Button>
                    </div>
                  </CardContent>

                  {/* Subtle corner decoration */}
                  <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#a0b830] opacity-10 rounded-tl-full" />
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Promo Code Modal - Step 1 */}
      {showPromoCodeModal && selectedPackage && (
        <PromoCodeModal
          isOpen={showPromoCodeModal}
          onClose={handlePromoCodeModalClose}
          onProceedToZipCode={handlePromoCodeComplete}
          packageName={selectedPackage.name}
          baseZipcodes={selectedPackage.profiles}
        />
      )}

      {/* ZIP Code Selection Modal - Step 2 */}
      {showZipCodeSelection && selectedPackage && (
        <ZipCodeSelectionModal
          isOpen={showZipCodeSelection}
          onClose={handleZipCodeSelectionClose}
          onProceedToPayment={handleZipCodeSelectionComplete}
          packageName={selectedPackage.name}
          maxZipcodes={getTotalZipcodes()}
          packageId={selectedPackage.id}
        />
      )}

      {/* Payment Modal - Step 3 */}
      {showPaymentModal && selectedPackage && selectedZipcodes.length > 0 && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={handlePaymentModalClose}
          packageId={selectedPackage.id}
          packageName={selectedPackage.name}
          amount={selectedPackage.price}
          zipcodes={selectedZipcodes}
        />
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </DashboardLayout>
  );
};

export default Subscription;