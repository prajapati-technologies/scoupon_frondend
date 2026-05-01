import { useState, useEffect } from "react";
import { PlusCircle, X, Loader2, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";

interface ZipCodeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToPayment: (zipcodes: string[]) => void;
  packageName: string;
  maxZipcodes: number;
  packageId: number;
}

const ZipCodeSelectionModal = ({ 
  isOpen, 
  onClose, 
  onProceedToPayment, 
  packageName, 
  maxZipcodes,
  packageId
}: ZipCodeSelectionModalProps) => {
  const [newZipcode, setNewZipcode] = useState("");
  const [selectedZipcodes, setSelectedZipcodes] = useState<string[]>([]);
  const [existingZipcodes, setExistingZipcodes] = useState<string[]>([]);
  const [isLoading] = useState(false);
  const [isFetchingZipcodes, setIsFetchingZipcodes] = useState(false);
  const [conflictingZipcodes, setConflictingZipcodes] = useState<string[]>([]);
  const [showConflictAlert, setShowConflictAlert] = useState(false);
  const [isRemovingZipcode, setIsRemovingZipcode] = useState<string | null>(null);

  // Fetch existing ZIP codes from backend
  // Updated code for extracting ZIP codes from the API response
const fetchExistingZipcodes = async () => {
  try {
    setIsFetchingZipcodes(true);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscribepackage/my/all/packages`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract all ZIP codes from the response
    const allZipcodes: string[] = [];
    
    // Check if data has zipCodes array
    if (data.zipCodes && Array.isArray(data.zipCodes)) {
      data.zipCodes.forEach((zipCodeObj: any) => {
        // If zipCodeObj has a zipcode property, extract it
        if (zipCodeObj.zipcode) {
          allZipcodes.push(zipCodeObj.zipcode);
        }
        // If zipCodeObj has a code property, extract it
        else if (zipCodeObj.code) {
          allZipcodes.push(zipCodeObj.code);
        }
        // If zipCodeObj is a string itself
        else if (typeof zipCodeObj === 'string') {
          allZipcodes.push(zipCodeObj);
        }
      });
    }
    
    // Remove duplicates
    const uniqueZipcodes = [...new Set(allZipcodes)];
    setExistingZipcodes(uniqueZipcodes);
    
  } catch (error) {
    console.error('Error fetching existing ZIP codes:', error);
    toast.error('Failed to load existing ZIP codes. Please try again.');
    setExistingZipcodes([]);
  } finally {
    setIsFetchingZipcodes(false);
  }
};

  // Check for conflicts with existing ZIP codes
  const checkForConflicts = (zipcodes: string[]) => {
    const conflicts = zipcodes.filter(zipcode => existingZipcodes.includes(zipcode));
    setConflictingZipcodes(conflicts);
    setShowConflictAlert(conflicts.length > 0);
    return conflicts;
  };

  // Fetch existing ZIP codes when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchExistingZipcodes();
      setSelectedZipcodes([]);
      setNewZipcode("");
      setConflictingZipcodes([]);
      setShowConflictAlert(false);
    }
  }, [isOpen]);

  // Check for conflicts whenever selected ZIP codes change
  useEffect(() => {
    if (selectedZipcodes.length > 0) {
      checkForConflicts(selectedZipcodes);
    } else {
      setConflictingZipcodes([]);
      setShowConflictAlert(false);
    }
  }, [selectedZipcodes, existingZipcodes]);

  const handleAddZipcode = () => {
    if (!newZipcode.trim()) {
      toast.error("Please enter a ZIP code");
      return;
    }

    // Validate ZIP code format (assuming US ZIP code format)
    const zipCodeRegex = /^\d{5}(-\d{4})?$/;
    if (!zipCodeRegex.test(newZipcode.trim())) {
      toast.error("Please enter a valid ZIP code (e.g., 12345 or 12345-6789)");
      return;
    }

    const trimmedZipcode = newZipcode.trim();

    // Check if zipcode already exists in user's account
    if (existingZipcodes.includes(trimmedZipcode)) {
      toast.error("You already have this ZIP code in your account");
      return;
    }

    // Check if zipcode is already in current selection
    if (selectedZipcodes.includes(trimmedZipcode)) {
      toast.error("This ZIP code is already selected");
      return;
    }

    if (selectedZipcodes.length >= maxZipcodes) {
      toast.error(`This package allows exactly ${maxZipcodes} ZIP codes.`);
      return;
    }

    const newSelection = [...selectedZipcodes, trimmedZipcode];
    setSelectedZipcodes(newSelection);
    setNewZipcode("");
    
    // Show success message with progress
    if (newSelection.length === maxZipcodes ) {
      toast.success(`Perfect! All ${maxZipcodes} ZIP codes added. Ready to proceed to payment!`);
    } else {
      toast.success(`ZIP code added! ${maxZipcodes - newSelection.length} more needed to complete.`);
    }
  };

  const handleRemoveZipcode = (zipcode: string) => {
    const newSelection = selectedZipcodes.filter(z => z !== zipcode);
    setSelectedZipcodes(newSelection);
    
    const remaining = maxZipcodes - newSelection.length;
    if (remaining > 0) {
      toast.info(`${remaining} more ZIP code${remaining > 1 ? 's' : ''} needed to proceed.`);
    }
  };

  const handleProceedToPayment = async () => {
    if (selectedZipcodes.length !== maxZipcodes) {
      toast.error(`Please add exactly ${maxZipcodes} ZIP codes to proceed with the ${packageName} package.`);
      return;
    }

    // Final conflict check before proceeding
    const conflicts = checkForConflicts(selectedZipcodes);
    if (conflicts.length > 0) {
      toast.error(`Cannot proceed: You already have ${conflicts.join(', ')} in your account. Please remove them and add different ZIP codes.`);
      return;
    }

    // Verify zipcodes with backend before proceeding to payment
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found. Please login again.');
        return;
      }

      // Use the packageId passed as prop

      const requestBody = {
        zipcodes: selectedZipcodes.map((zipcode) => ({
          zipcode: zipcode.trim(),
        })),
      };

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/transactions/verify-zipcodes/${packageId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      const data = await response.json();

      if (data.success) {
        // All zipcodes are available, proceed to payment
        onProceedToPayment(selectedZipcodes);
      } else if (data.error === 'DUPLICATE_ZIPCODES') {
        // Show notification that zipcodes already exist
        toast.error(data.message);
        return;
      } else {
        toast.error('Failed to verify ZIP codes. Please try again.');
        return;
      }
    } catch (error) {
      console.error('Error verifying ZIP codes:', error);
      toast.error('Failed to verify ZIP codes. Please try again.');
      return;
    }
  };

  const handleClose = () => {
    setSelectedZipcodes([]);
    setNewZipcode("");
    setExistingZipcodes([]);
    setConflictingZipcodes([]);
    setShowConflictAlert(false);
    onClose();
  };

  const handleRemoveConflictingZipcodes = () => {
    const cleanedSelection = selectedZipcodes.filter(zipcode => !conflictingZipcodes.includes(zipcode));
    setSelectedZipcodes(cleanedSelection);
    toast.success(`Removed ${conflictingZipcodes.length} conflicting ZIP code${conflictingZipcodes.length > 1 ? 's' : ''}`);
  };

  // Function to remove existing zipcode from user's account
  const handleRemoveExistingZipcode = async (zipcode: string) => {
    try {
      setIsRemovingZipcode(zipcode);
      
      // First, find the zipcode ID from the existing zipcodes
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/subscribepackage/my/all/packages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      let zipcodeId = null;
      
      // Find the zipcode ID
      if (data.zipCodes && Array.isArray(data.zipCodes)) {
        const zipcodeObj = data.zipCodes.find((zip: any) => 
          zip.zipcode === zipcode || zip.code === zipcode
        );
        if (zipcodeObj) {
          zipcodeId = zipcodeObj.id;
        }
      }
      
      if (!zipcodeId) {
        throw new Error('ZIP code ID not found');
      }
      
      // Remove the zipcode
      const deleteResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/zipcode/${zipcodeId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!deleteResponse.ok) {
        throw new Error(`Failed to delete ZIP code: ${deleteResponse.status}`);
      }
      
      // Update the existing zipcodes list
      setExistingZipcodes(prev => prev.filter(z => z !== zipcode));
      
      // If this zipcode was in the selected list, remove it from there too
      setSelectedZipcodes(prev => prev.filter(z => z !== zipcode));
      
      toast.success(`ZIP code ${zipcode} removed successfully`);
      
    } catch (error) {
      console.error('Error removing ZIP code:', error);
      toast.error('Failed to remove ZIP code. Please try again.');
    } finally {
      setIsRemovingZipcode(null);
    }
  };

  const canAddMore = selectedZipcodes.length < maxZipcodes;
  const canProceedToPayment = selectedZipcodes.length === maxZipcodes && conflictingZipcodes.length === 0;
  const remainingZipcodes = maxZipcodes - selectedZipcodes.length;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#a0b830]" />
            Add ZIP Codes for {packageName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Loading State for Fetching ZIP Codes */}
          {isFetchingZipcodes && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <p className="text-blue-800 text-sm">Loading existing ZIP codes...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conflict Alert */}
          {showConflictAlert && conflictingZipcodes.length > 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-800 text-sm font-medium">
                      ZIP Code Conflict Detected
                    </p>
                    <p className="text-red-700 text-sm mt-1">
                      You already have these ZIP codes in your account: <span className="font-semibold">{conflictingZipcodes.join(', ')}</span>
                    </p>
                    <Button
                      onClick={handleRemoveConflictingZipcodes}
                      size="sm"
                      variant="outline"
                      className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
                    >
                      Remove Conflicting ZIP Codes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Package Info Card */}
          <Card className="bg-gradient-to-r from-[#a0b830]/5 to-[#a0b830]/10 border-[#a0b830]/20">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{packageName}</h3>
                  <p className="text-sm text-gray-600">
                    This package requires exactly <span className="font-bold text-[#a0b830]">{maxZipcodes}</span> ZIP codes
                  </p>
                  {existingZipcodes.length > 0 && (
                    <p className="text-xs text-orange-600 mt-1">
                      You already have {existingZipcodes.length} ZIP code{existingZipcodes.length !== 1 ? 's' : ''} in your account
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-black">
                    {selectedZipcodes.length}/{maxZipcodes}
                  </div>
                  <div className="text-xs text-gray-500">ZIP codes</div>
                  {conflictingZipcodes.length > 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      {conflictingZipcodes.length} conflicts
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing ZIP Codes Section */}
          {existingZipcodes.length > 0 && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Your Existing ZIP Codes ({existingZipcodes.length})
                  </span>
                  <span className="text-sm font-normal text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    Click X to remove
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {existingZipcodes.map((zipcode, index) => (
                    <div
                      key={`existing-${zipcode}-${index}`}
                      className="px-3 py-2 rounded-lg flex items-center gap-2 bg-blue-100 border border-blue-300 hover:bg-blue-200 transition-colors"
                    >
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        {zipcode}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingZipcode(zipcode)}
                        className="transition-colors p-1 rounded text-blue-600 hover:text-red-600 hover:bg-red-100"
                        disabled={isRemovingZipcode === zipcode}
                        title="Remove ZIP code from your account"
                      >
                        {isRemovingZipcode === zipcode ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  These ZIP codes are already in your account. Remove them if you want to add them to this new package.
                </p>
              </CardContent>
            </Card>
          )}

          {/* ZIP Code Input Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Add New ZIP Codes
                {remainingZipcodes > 0 && (
                  <span className="text-sm font-normal text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    {remainingZipcodes} more needed
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${
                    canProceedToPayment ? 'bg-green-500' : 
                    conflictingZipcodes.length > 0 ? 'bg-red-500' : 'bg-[#a0b830]'
                  }`}
                  style={{ width: `${(selectedZipcodes.length / maxZipcodes) * 100}%` }}
                ></div>
              </div>

              {/* ZIP Code Input */}
              <div className="flex items-center gap-2">
                <Input
                  value={newZipcode}
                  onChange={(e) => setNewZipcode(e.target.value)}
                  placeholder="Enter ZIP code (e.g., 12345)"
                  disabled={isLoading || !canAddMore || isFetchingZipcodes}
                  maxLength={10}
                  className="flex-1"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddZipcode();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddZipcode}
                  className="bg-[#a0b830] hover:bg-[#8fa029] text-white"
                  disabled={isLoading || !canAddMore || isFetchingZipcodes}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4 mr-1" /> Add
                    </>
                  )}
                </Button>
              </div>

              {/* Status Messages */}
              {!canAddMore && selectedZipcodes.length === maxZipcodes && conflictingZipcodes.length === 0 && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <p className="text-green-800 text-sm font-medium">
                      Perfect! You've added all {maxZipcodes} required ZIP codes. Ready to proceed!
                    </p>
                  </div>
                </div>
              )}

              {conflictingZipcodes.length > 0 && selectedZipcodes.length === maxZipcodes && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-red-800 text-sm font-medium">
                      Cannot proceed due to ZIP code conflicts. Please remove conflicting ZIP codes above.
                    </p>
                  </div>
                </div>
              )}

              {!canAddMore && selectedZipcodes.length < maxZipcodes && (
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    You've reached the maximum. Remove some ZIP codes if you want to add different ones.
                  </p>
                </div>
              )}

              {/* Selected ZIP Codes Display */}
              <div className="mt-4">
                <Label className="text-sm font-medium">Selected ZIP Codes</Label>
                <div className="mt-2 min-h-[60px] border-2 border-dashed border-gray-200 rounded-lg p-3">
                  {selectedZipcodes.length === 0 ? (
                    <div className="flex items-center justify-center h-12 text-gray-400">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span className="text-sm">No ZIP codes added yet</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedZipcodes.map((zipcode, index) => {
                        const isConflicting = conflictingZipcodes.includes(zipcode);
                        return (
                          <div
                            key={`${zipcode}-${index}`}
                            className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                              isConflicting 
                                ? 'bg-red-100 border border-red-300 text-red-800' 
                                : 'bg-[#a0b830] bg-opacity-10 border border-[#a0b830] hover:bg-[#a0b830] hover:bg-opacity-20'
                            }`}
                          >
                            <MapPin className={`h-4 w-4 ${isConflicting ? 'text-red-600' : 'text-[#a0b830]'}`} />
                            <span className={`font-medium ${isConflicting ? 'text-red-800' : 'text-black'}`}>
                              {zipcode}
                            </span>
                            {isConflicting && (
                              <AlertCircle className="h-3 w-3 text-red-600" />
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveZipcode(zipcode)}
                              className={`transition-colors p-1 rounded bg-[#fb3936] ${
                                isConflicting 
                                  ? 'text-red-600 hover:text-red-800 hover:bg-red-200' 
                                  : 'text-[#a0b830] hover:text-red-500 hover:bg-red-50'
                              }`}
                              disabled={isLoading}
                              title="Remove ZIP code"
                            >
                              <X className="h-4 w-4 text-[#a0b830]" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProceedToPayment}
              className={`flex-1 text-white transition-all ${
                canProceedToPayment 
                  ? 'bg-green-600 hover:bg-green-700 shadow-lg' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
              disabled={isLoading || !canProceedToPayment || isFetchingZipcodes}
            >
              {canProceedToPayment ? (
                <>
                  Proceed to Payment 
                  <span className="ml-2 bg-gray-950 bg-opacity-20 px-2 py-1 rounded text-sm">
                    {selectedZipcodes.length} ZIP codes
                  </span>
                </>
              ) : conflictingZipcodes.length > 0 ? (
                'Resolve Conflicts First'
              ) : (
                `Add ${remainingZipcodes} more ZIP code${remainingZipcodes !== 1 ? 's' : ''}`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ZipCodeSelectionModal;