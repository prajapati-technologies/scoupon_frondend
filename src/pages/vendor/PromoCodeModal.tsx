import { useState } from "react";
import { Gift, Loader2, AlertCircle, CheckCircle, X } from "lucide-react";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";

interface PromoCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToZipCode: (extraZipcodes: number) => void;
  packageName: string;
  baseZipcodes: number;
}

interface PromoCode {
  id: string;
  code: string;
  maxZipCode: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

const PromoCodeModal = ({ 
  isOpen, 
  onClose, 
  onProceedToZipCode, 
  packageName, 
  baseZipcodes 
}: PromoCodeModalProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validatedPromo, setValidatedPromo] = useState<PromoCode | null>(null);
  const [error, setError] = useState("");

  const handleValidatePromo = async () => {
    if (!promoCode.trim()) {
      setError("Please enter a promo code");
      return;
    }

    setIsValidating(true);
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/promos/validate/${promoCode.trim()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Invalid promo code');
      }

      const promoData = await response.json();
      setValidatedPromo(promoData);
      toast.success(`Promo code applied! You can now add ${promoData.maxZipCode} extra ZIP codes.`);
    } catch (error: any) {
      setError(error.message || 'Failed to validate promo code');
      setValidatedPromo(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleProceedWithPromo = () => {
    if (validatedPromo) {
      onProceedToZipCode(validatedPromo.maxZipCode);
    }
  };

  const handleSkipPromo = () => {
    onProceedToZipCode(0);
  };

  const handleClose = () => {
    setPromoCode("");
    setValidatedPromo(null);
    setError("");
    onClose();
  };

  const totalZipcodes = baseZipcodes + (validatedPromo?.maxZipCode || 0);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-[#a0b830]" />
            Promo Code - Extra ZIP Codes
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 w-full max-w-md mx-auto">
          {/* Package Info */}
          <Card className="bg-gradient-to-r from-[#a0b830]/5 to-[#a0b830]/10 border-[#a0b830]/20">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{packageName}</h3>
                  <p className="text-sm text-gray-600">
                    Base ZIP codes: <span className="font-bold text-[#a0b830]">{baseZipcodes}</span>
                  </p>
                  {validatedPromo && (
                    <p className="text-sm text-green-600 mt-1">
                      Extra ZIP codes: <span className="font-bold">+{validatedPromo.maxZipCode}</span>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#a0b830]">
                    {totalZipcodes}
                  </div>
                  <div className="text-xs text-gray-500">
                    Total ZIP codes
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Promo Code Input */}
          <Card className="mx-auto bg-white shadow-lg border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="h-5 w-5 text-[#a0b830]" />
                Enter Promo Code
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="promo-code">Promo Code</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="promo-code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter promo code"
                    disabled={isValidating || validatedPromo !== null}
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !validatedPromo) {
                        handleValidatePromo();
                      }
                    }}
                  />
                  {!validatedPromo && (
                    <Button
                      type="button"
                      onClick={handleValidatePromo}
                      className="bg-[#a0b830] hover:bg-[#8fa029] text-white"
                      disabled={isValidating || !promoCode.trim()}
                    >
                      {isValidating ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Validate"
                      )}
                    </Button>
                  )}
                  {validatedPromo && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">Valid</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {validatedPromo && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="text-green-800 text-sm font-medium">
                        Promo code "{validatedPromo.code}" applied successfully!
                      </p>
                      <p className="text-green-700 text-sm mt-1">
                        You can now add <span className="font-bold">{validatedPromo.maxZipCode} extra ZIP codes</span> to your package.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setValidatedPromo(null);
                        setPromoCode("");
                        setError("");
                      }}
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-800 hover:bg-green-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Info Message */}
              {!validatedPromo && (
                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-blue-600" />
                    <p className="text-blue-800 text-sm">
                      Have a promo code? Enter it above to unlock additional ZIP codes for your package!
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-1 p-2">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isValidating}
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleSkipPromo}
              className="flex-1"
              disabled={isValidating}
            >
              Skip & Continue
            </Button>
            {validatedPromo && (
              <Button
                onClick={handleProceedWithPromo}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={isValidating}
              >
                Proceed 
                <span className="ml-2 bg-green-800 bg-opacity-20 px-2 py-1 rounded text-sm">
                  {totalZipcodes} ZIP codes
                </span>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoCodeModal;