import { useState, useEffect } from "react";
import { useAuth } from "../../../useAuth";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Crown,
  CheckCircle,
  XCircle,
  Clock,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import { AdminDashboardLayout } from "../layout/AdminDashboardLayout";

interface PremiumAd {
  id: number;
  userId: number;
  row: number;
  position: number;
  status: string;
  note: string | null;
  adminNote: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    company: string;
    companyLogo: string;
    vendorType: string;
    city: string;
    state: string;
    phone: string;
  };
}

interface SearchVendor {
  id: number;
  name: string;
  email: string;
  company: string;
  companyLogo: string;
  vendorType: string;
  city: string;
  state: string;
}

const AdminPremiumAds = () => {
  const { user } = useAuth();
  const [ads, setAds] = useState<PremiumAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchVendor[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<SearchVendor | null>(null);
  const [createRow, setCreateRow] = useState(1);
  const [createPosition, setCreatePosition] = useState(1);
  const [createNote, setCreateNote] = useState("");

  // Update modal state
  const [editingAd, setEditingAd] = useState<PremiumAd | null>(null);
  const [editRow, setEditRow] = useState(1);
  const [editPosition, setEditPosition] = useState(1);
  const [editAdminNote, setEditAdminNote] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const fetchAds = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/premium-ad/all${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAds(res.data);
    } catch (error) {
      console.error("Failed to fetch premium ads:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, [statusFilter]);

  const handleSearchVendors = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/premium-ad/search-vendors?q=${encodeURIComponent(searchQuery)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSearchResults(res.data);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearching(false);
    }
  };

  const handleAdminCreate = async () => {
    if (!selectedVendor) {
      toast.error("Please select a vendor.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/premium-ad/admin-create`,
        {
          userId: selectedVendor.id,
          row: createRow,
          position: createPosition,
          adminNote: createNote || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Premium ad created successfully!");
      setShowCreateModal(false);
      setSelectedVendor(null);
      setSearchQuery("");
      setSearchResults([]);
      setCreateNote("");
      fetchAds();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create premium ad.");
    }
  };

  const handleUpdate = async () => {
    if (!editingAd) return;
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/premium-ad/${editingAd.id}`,
        {
          status: editStatus,
          row: editRow,
          position: editPosition,
          adminNote: editAdminNote || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Premium ad updated successfully!");
      setEditingAd(null);
      fetchAds();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update premium ad.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this premium ad?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/premium-ad/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Premium ad removed.");
      fetchAds();
    } catch (error) {
      toast.error("Failed to remove premium ad.");
    }
  };

  const openEditModal = (ad: PremiumAd) => {
    setEditingAd(ad);
    setEditRow(ad.row);
    setEditPosition(ad.position);
    setEditAdminNote(ad.adminNote || "");
    setEditStatus(ad.status === "PENDING" ? "APPROVED" : ad.status);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <AdminDashboardLayout title="Premium Ads Management" user={user}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-900">Premium Ad Spots</h1>
          </div>
          <div className="flex items-center gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-[#1a5c1a] hover:bg-[#145214] text-white"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" /> Create Ad
            </Button>
          </div>
        </div>

        {/* Ads Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading...</p>
            </div>
          ) : ads.length === 0 ? (
            <div className="text-center py-12">
              <Crown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No premium ads found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Vendor</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Row</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Position</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Note</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ads.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                            {ad.user.companyLogo ? (
                              <img
                                src={ad.user.companyLogo}
                                alt={ad.user.company}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-bold text-gray-500">
                                {ad.user.company?.charAt(0) || ad.user.name?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{ad.user.company || ad.user.name}</p>
                            <p className="text-xs text-gray-500">{ad.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{ad.user.vendorType}</td>
                      <td className="px-4 py-3 text-gray-600">{ad.row}</td>
                      <td className="px-4 py-3 text-gray-600">{ad.position}</td>
                      <td className="px-4 py-3">{getStatusBadge(ad.status)}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">
                        {ad.note || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(ad)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(ad.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Create Premium Ad</h2>

              {/* Search Vendor */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Vendor
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by name, company, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchVendors()}
                  />
                  <Button onClick={handleSearchVendors} disabled={searching}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && !selectedVendor && (
                <div className="mb-4 max-h-40 overflow-y-auto border rounded-md">
                  {searchResults.map((v) => (
                    <button
                      key={v.id}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 flex items-center gap-3"
                      onClick={() => {
                        setSelectedVendor(v);
                        setSearchResults([]);
                      }}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {v.companyLogo ? (
                          <img src={v.companyLogo} alt={v.company} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-bold">{v.company?.charAt(0) || v.name?.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{v.company || v.name}</p>
                        <p className="text-xs text-gray-500">{v.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Selected Vendor */}
              {selectedVendor && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {selectedVendor.companyLogo ? (
                        <img src={selectedVendor.companyLogo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold">{selectedVendor.company?.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{selectedVendor.company || selectedVendor.name}</p>
                      <p className="text-xs text-gray-500">{selectedVendor.vendorType}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedVendor(null)}>
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Row & Position */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Row</label>
                  <Select value={String(createRow)} onValueChange={(v) => setCreateRow(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Row 1</SelectItem>
                      <SelectItem value="2">Row 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <Select value={String(createPosition)} onValueChange={(v) => setCreatePosition(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Position 1</SelectItem>
                      <SelectItem value="2">Position 2</SelectItem>
                      <SelectItem value="3">Position 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Note */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Note</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 text-sm"
                  rows={2}
                  placeholder="Optional admin note..."
                  value={createNote}
                  onChange={(e) => setCreateNote(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedVendor(null);
                    setSearchResults([]);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#1a5c1a] hover:bg-[#145214] text-white"
                  onClick={handleAdminCreate}
                >
                  Create Ad
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit/Approve Modal */}
      {editingAd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Update Premium Ad - {editingAd.user.company || editingAd.user.name}
              </h2>

              {/* Status */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <Select value={editStatus} onValueChange={setEditStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPROVED">Approve</SelectItem>
                    <SelectItem value="REJECTED">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Row & Position */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Row</label>
                  <Select value={String(editRow)} onValueChange={(v) => setEditRow(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Row 1</SelectItem>
                      <SelectItem value="2">Row 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <Select value={String(editPosition)} onValueChange={(v) => setEditPosition(Number(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Position 1</SelectItem>
                      <SelectItem value="2">Position 2</SelectItem>
                      <SelectItem value="3">Position 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Vendor Note */}
              {editingAd.note && (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-xs text-gray-500 mb-1">Vendor's Note:</p>
                  <p className="text-sm text-gray-700">{editingAd.note}</p>
                </div>
              )}

              {/* Admin Note */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Note</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md p-3 text-sm"
                  rows={2}
                  placeholder="Optional note for vendor..."
                  value={editAdminNote}
                  onChange={(e) => setEditAdminNote(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingAd(null)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-[#1a5c1a] hover:bg-[#145214] text-white"
                  onClick={handleUpdate}
                >
                  Update
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardLayout>
  );
};

export default AdminPremiumAds;
