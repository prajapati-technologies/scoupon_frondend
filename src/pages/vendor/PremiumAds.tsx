import { useState, useEffect } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { useAuth } from "../../useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "../../components/ui/button";
import { Crown, CheckCircle, Clock, XCircle } from "lucide-react";

const PremiumAds = () => {
  const { user } = useAuth();
  const [myAd, setMyAd] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [note, setNote] = useState("");

  const fetchMyAd = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/premium-ad/my-ad`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMyAd(res.data);
    } catch (error) {
      console.error("Failed to fetch premium ad status:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyAd();
  }, []);

  const handleApply = async () => {
    setApplying(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/premium-ad/apply`,
        { note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Premium ad application submitted successfully!");
      fetchMyAd();
      setNote("");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to apply for premium ad."
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <DashboardLayout title="Premium Ad Spot" user={user}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a5c1a] to-[#2d7a2d] rounded-lg p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Crown className="w-8 h-8 text-yellow-300" />
            <h1 className="text-2xl font-bold">Premium Ad Spots</h1>
          </div>
          <p className="text-green-100">
            Get your business featured at the top of the vendor listing page.
            Premium ads appear first when customers search for vendors.
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Why Go Premium?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏪</span>
              </div>
              <h3 className="font-semibold text-sm text-gray-900">Be the First</h3>
              <p className="text-xs text-gray-600 mt-1">
                Your business appears at the very top of the vendor list
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold text-sm text-gray-900">More Visibility</h3>
              <p className="text-xs text-gray-600 mt-1">
                Premium badge makes your listing stand out
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏷️</span>
              </div>
              <h3 className="font-semibold text-sm text-gray-900">Priority Display</h3>
              <p className="text-xs text-gray-600 mt-1">
                Your profile card shows with a premium badge
              </p>
            </div>
          </div>
        </div>

        {/* Status / Apply Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : myAd ? (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">Your Premium Ad Status</h2>
              <div className="flex items-center gap-3 p-4 rounded-lg border">
                {myAd.status === "PENDING" && (
                  <>
                    <Clock className="w-6 h-6 text-yellow-500" />
                    <div>
                      <p className="font-semibold text-yellow-700">Pending Review</p>
                      <p className="text-sm text-gray-600">
                        Your application is being reviewed by the admin team.
                      </p>
                    </div>
                  </>
                )}
                {myAd.status === "APPROVED" && (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-700">Approved & Active</p>
                      <p className="text-sm text-gray-600">
                        Your premium ad is live! Row {myAd.row}, Position {myAd.position}.
                      </p>
                      {myAd.adminNote && (
                        <p className="text-xs text-gray-500 mt-1">
                          Admin note: {myAd.adminNote}
                        </p>
                      )}
                    </div>
                  </>
                )}
                {myAd.status === "REJECTED" && (
                  <>
                    <XCircle className="w-6 h-6 text-red-500" />
                    <div>
                      <p className="font-semibold text-red-700">Rejected</p>
                      <p className="text-sm text-gray-600">
                        Your application was not approved.
                      </p>
                      {myAd.adminNote && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reason: {myAd.adminNote}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Apply for Premium Ad Spot
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Submit your request to get your vendor profile featured at the top of
                the vendor listing page. Admin will review and approve your request.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (optional)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Tell us why you'd like a premium spot..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <Button
                onClick={handleApply}
                disabled={applying}
                className="w-full bg-[#1a5c1a] hover:bg-[#145214] text-white py-3"
              >
                {applying ? "Submitting..." : "Claim This Spot"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PremiumAds;
