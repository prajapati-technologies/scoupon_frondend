import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Loader2, MapPin, DollarSign, Package } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: number;
  packageName: string;
  amount: number;
  zipcodes: string[];
}

export const PaymentModal = ({
  isOpen,
  onClose,
  packageId,
  packageName,
  amount,
  zipcodes
}: PaymentModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleInitiatePayment = async () => {
    try {
      setLoading(true);
      
      // Log the data being sent for debugging
      console.log('Initiating payment with data:', {
        packageId,
        packageName,
        amount,
        zipcodes
      });

      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }

      // Prepare the request body with ZIP codes
      const requestBody = {
        zipcodes: zipcodes.map((zipcode) => ({
          zipcode: zipcode.trim(),
        })),
      };

      console.log('Request body:', requestBody);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/transactions/create-session/${packageId}`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Payment response:', response.data);

      // Check if the response contains the payment URL
      if (response.data && response.data.paymentUrl) {
        // Show success message before redirect
        toast.success('Payment session created successfully. Redirecting to payment...');
        
        // Add a small delay to ensure the toast is visible
        setTimeout(() => {
          window.location.href = response.data.paymentUrl;
        }, 1000);
      } else {
        console.error('Invalid payment response:', response.data);
        toast.error(response.data.message);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      
      let errorMessage = 'Failed to initialize payment';
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error
        const serverMessage = error.response.data?.message || error.response.data?.error;
        if (serverMessage) {
          errorMessage = serverMessage;
        } else {
          errorMessage = `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check your connection.';
      } else {
        // Other error
        errorMessage = error.message || 'Unknown error occurred';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-[#a0b830]" />
            Subscribe to {packageName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Package Summary Card */}
          <Card className="p-4 bg-gradient-to-r from-[#a0b830]/5 to-[#a0b830]/10 border-[#a0b830]/20">
            <div className="space-y-4">
              {/* Amount Display */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-[#a0b830]" />
                  <span className="text-lg font-semibold">Total Amount:</span>
                </div>
                <span className="text-2xl font-bold text-[#a0b830]">${amount}</span>
              </div>
              
              {/* ZIP Codes Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#a0b830]" />
                  <h4 className="font-medium">Selected ZIP Codes ({zipcodes.length}):</h4>
                </div>
                
                <div className="max-h-32 overflow-y-auto">
                  <div className="flex flex-wrap gap-2">
                    {zipcodes.map((zipcode, index) => (
                      <span 
                        key={`${zipcode}-${index}`}
                        className="bg-[#a0b830] bg-opacity-10 border border-[#a0b830] px-3 py-1 rounded-lg text-sm text-white font-medium"
                      >
                        {zipcode}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Package Details */}
              <div className="pt-2 border-t border-[#a0b830]/20">
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Package:</strong> {packageName}</p>
                  <p><strong>ZIP Codes:</strong> {zipcodes.length} locations selected</p>
                  <p className="text-xs mt-2 text-gray-500">
                    You will be redirected to QuickPay's secure payment page to complete your payment.
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInitiatePayment}
              disabled={loading || zipcodes.length === 0}
              className="flex-1 bg-[#a0b830] hover:bg-[#8fa029] text-black"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Payment
                  <span className="ml-2 bg-white bg-opacity-20 px-2 py-1 rounded text-xs">
                    ${amount}
                  </span>
                </>
              )}
            </Button>
          </div>
          
          {/* Debug Info (remove in production) */}
          {/* {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
              <strong>Debug Info:</strong>
              <pre className="mt-1 text-xs">
                {JSON.stringify({ packageId, packageName, amount, zipcodesCount: zipcodes.length }, null, 2)}
              </pre>
            </div>
          )} */}
        </div>
      </DialogContent>
    </Dialog>
  );
};