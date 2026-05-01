import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Loader2 } from 'lucide-react';
// import { Zipcode } from '../../ProtectedRouteProps';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId: number;
  packageName: string;
  amount: number;
}

export const PaymentModal = ({ 
  isOpen, 
  onClose, 
  packageId, 
  packageName, 
  amount 
}: PaymentModalProps) => {
  const [loading, setLoading] = useState(false);
 

  const handleInitiatePayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/transactions/create-session/${packageId}`,
        {},  // No need to send card details
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      if (response.data && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        toast.error('Invalid payment response');
      }
    } catch (error) {
      toast.error('Failed to initialize payment');
      console.error('Payment error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subscribe to {packageName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <Card className="p-4">
            <div className="text-lg font-semibold mb-4">
              Amount: ${amount}
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                You will be redirected to QuickPay's secure payment page to complete your payment.
              </p>
            </div>
          </Card>
          <Button 
            onClick={handleInitiatePayment}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : 'Proceed to Payment'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};