import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Eye, Trash2, CheckCircle, XCircle, Filter, Edit } from 'lucide-react';
import { useAuth } from '../../../useAuth';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table";
import { Button } from '../../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from '../../../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select";
import { AdminDashboardLayout } from '../layout/AdminDashboardLayout';
import { Roles } from '../../../ProtectedRouteProps';
import { Link } from 'react-router-dom';

interface User {
    id: number;
    name: string;
    email: string;
    status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
    createdAt: string;
    utype: string;
    phone: string;
    company: string;
    businessName: string;
    state: string;
    city: string;
    zipcode: string;
    address: string;
    country: string;
    companyLogo: string;
    profileImg: string;
}

const Vendors = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [utypeFilter, setUtypeFilter] = useState<string>('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const userTypes = ['ALL', 'SUPERADMIN', 'ADMIN', 'SUBADMIN', 'VENDOR'];

    useEffect(() => {
        fetchVendors();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, utypeFilter, users]);

    const fetchVendors = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            toast.error('Failed to fetch vendors');
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = users;

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((user) => (
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.company?.toLowerCase().includes(query) ||
                user.address?.toLowerCase().includes(query) ||
                user.city?.toLowerCase().includes(query) ||
                user.state?.toLowerCase().includes(query) ||
                user.country?.toLowerCase().includes(query)
            ));
        }

        // Apply utype filter
        if (utypeFilter !== 'ALL') {
            filtered = filtered.filter((user) => user.utype === utypeFilter);
        }

        setFilteredUsers(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const clearFilters = () => {
        setSearchQuery('');
        setUtypeFilter('ALL');
    };

    const handleStatusUpdate = async (vendorId: number, currentStatus: string) => {
        let newStatus;

        switch (currentStatus) {
            case 'PENDING':
                newStatus = 'ACTIVE';
                break;
            case 'ACTIVE':
                newStatus = 'SUSPENDED';
                break;
            case 'SUSPENDED':
                newStatus = 'ACTIVE';
                break;
            default:
                newStatus = currentStatus;
        }

        try {
            await axios.patch(
                `${import.meta.env.VITE_BACKEND_URL}/user/${vendorId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            toast.success('Vendor status updated successfully');
            fetchVendors();
        } catch (error) {
            toast.error('Failed to update vendor status');
        }
    };

    const handleDelete = async (vendorId: number) => {
        if (!window.confirm('Are you sure you want to delete this vendor?')) {
            return;
        }

        try {
            await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/user/${vendorId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            toast.success('Vendor deleted successfully');
            fetchVendors();
        } catch (error) {
            toast.error('Failed to delete vendor');
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'ACTIVE':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'SUSPENDED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getUtypeBadgeColor = (utype: string) => {
        switch (utype) {
            case 'SUPERADMIN':
                return 'bg-purple-100 text-purple-800';
            case 'ADMIN':
                return 'bg-blue-100 text-blue-800';
            case 'SUBADMIN':
                return 'bg-indigo-100 text-indigo-800';
            case 'VENDOR':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredUsers.slice(indexOfFirstRow, indexOfLastRow);

    const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);
    const hasPermission = (permissionName: Roles): boolean => {
        if (!user?.permissions) return false;
        return user.permissions.some(permission => permission.name === permissionName);
    };

    // Helper function to check if user can perform action
    const canPerformAction = (action: 'Editing' | 'Deletion' | 'Approval'): boolean => {
        if (!user) return false;

        // SUPERADMIN can do everything
        if (user.utype === 'SUPERADMIN') {
            return true;
        }

        // ADMIN can do everything
        if (user.utype === 'ADMIN') {
            return hasPermission(action);
        }

        // SUBADMIN needs specific permissions
        if (user.utype === 'SUBADMIN') {
            return hasPermission(action);
        }

        return false;
    };

    return (
        <AdminDashboardLayout title="Manage Vendors" user={user}>
            <div className="space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">All Users</h2>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="flex items-center gap-2"
                            >
                                <Filter className="h-4 w-4" />
                                Clear Filters
                            </Button>
                        </div>
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <Input
                            type="text"
                            placeholder="Search vendors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 min-w-[250px] max-w-[400px]"
                        />

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">User Type:</span>
                            <Select value={utypeFilter} onValueChange={setUtypeFilter}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Filter by type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {userTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type === 'ALL' ? 'All Types' : type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Results Summary */}
                    <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>
                            Showing {filteredUsers.length} of {users.length} users
                            {utypeFilter !== 'ALL' && ` (filtered by ${utypeFilter})`}
                        </span>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-8">Loading vendors...</div>
                ) : (
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>S.No</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>UType</TableHead>
                                    <TableHead>Business</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentRows.length > 0 ? (
                                    currentRows.map((user, index) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium text-center">
                                                {filteredUsers.length - (indexOfFirstRow + index)}
                                            </TableCell>    
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUtypeBadgeColor(user.utype)}`}>
                                                    {user.utype}
                                                </span>
                                            </TableCell>
                                            <TableCell>{user.company || 'Not set'}</TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                                                    {user.status}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setSelectedUser(user)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-2xl">
                                                            <DialogHeader>
                                                                <DialogTitle>User Details</DialogTitle>
                                                            </DialogHeader>
                                                            {selectedUser && (
                                                                <div className="space-y-6">
                                                                    {/* Personal Information */}
                                                                    <div className="p-4 border rounded-lg shadow-md bg-white">
                                                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div>
                                                                                <p className="text-gray-600">
                                                                                    <span className="font-medium">Name:</span> {selectedUser.name}
                                                                                </p>
                                                                                <p className="text-gray-600">
                                                                                    <span className="font-medium">Email:</span> {selectedUser.email}
                                                                                </p>
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-gray-600">
                                                                                    <span className="font-medium">User Type:</span>
                                                                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getUtypeBadgeColor(selectedUser.utype)}`}>
                                                                                        {selectedUser.utype}
                                                                                    </span>
                                                                                </p>
                                                                                <p className="text-gray-600">
                                                                                    <span className="font-medium">Status:</span>
                                                                                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedUser.status)}`}>
                                                                                        {selectedUser.status}
                                                                                    </span>
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    {/* Business Information */}
                                                                    {selectedUser.company && (
                                                                        <div className="p-4 border rounded-lg shadow-md bg-white">
                                                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
                                                                            <div className="flex items-center space-x-4">
                                                                                {selectedUser.companyLogo && (
                                                                                    <img
                                                                                        src={selectedUser.companyLogo}
                                                                                        alt={`${selectedUser.company} Logo`}
                                                                                        className="w-16 h-16 object-cover rounded-full border"
                                                                                    />
                                                                                )}
                                                                                <div>
                                                                                    <p className="text-gray-800 text-lg font-medium">{selectedUser.company}</p>
                                                                                    {selectedUser.address && (
                                                                                        <p className="text-gray-600 text-sm">{selectedUser.address}</p>
                                                                                    )}
                                                                                    {(selectedUser.city || selectedUser.state || selectedUser.country) && (
                                                                                        <p className="text-gray-600 text-sm">
                                                                                            {[selectedUser.city, selectedUser.state, selectedUser.country].filter(Boolean).join(', ')}
                                                                                            {selectedUser.zipcode && ` - ${selectedUser.zipcode}`}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </DialogContent>
                                                    </Dialog>
                                                    
                                                    {canPerformAction('Editing') && (
                                                        <>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleStatusUpdate(user.id, user.status)}
                                                                title={
                                                                    user.status === 'PENDING'
                                                                        ? 'Approve user'
                                                                        : user.status === 'ACTIVE'
                                                                            ? 'Suspend user'
                                                                            : 'Activate user'
                                                                }
                                                            >
                                                                {user.status === 'PENDING' ? (
                                                                    <CheckCircle className="h-4 w-4 text-yellow-500" />
                                                                ) : user.status === 'ACTIVE' ? (
                                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                                ) : (
                                                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                                                )}
                                                            </Button>

                                                            {/* Edit Admin Button - Only show for non-VENDOR users */}
                                                            {user && user.utype !== 'VENDOR' && (
                                                                <Link to={`/admin/update-user/${user.id}`}>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        title="Edit Admin User"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                            )}
                                                        </>
                                                    )}
                                                   

                                                    {canPerformAction('Deletion') && (
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(user.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                            No users found matching your filters.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                    <div className="flex justify-between items-center mt-4">
                        <Button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages} ({filteredUsers.length} total results)
                        </span>
                        <Button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable pauseOnFocusLoss theme="light" />
        </AdminDashboardLayout >
    );
};

export default Vendors;