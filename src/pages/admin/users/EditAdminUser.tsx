import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminDashboardLayout } from "../layout/AdminDashboardLayout";
import { useAuth } from "../../../useAuth";
import { toast } from "react-toastify";
import { Input } from "../../../components/ui/input";
import { Card, CardContent } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { X, ArrowLeft, Loader2 } from "lucide-react";

interface EditUserProps {
    name: string;
    email: string;
    phone: string;
    utype: string;
    status: string;
    permissions: string[];
    routes: string[];
}

interface UserData {
    id: number;
    name: string;
    email: string;
    phone: string;
    utype: string;
    status: string;
    permissions: Array<{ name: string }>;
    routes: Array<{ name: string }>;
    createdAt: string;
    company?: string;
    businessName?: string;
    state?: string;
    city?: string;
    zipcode?: string;
    address?: string;
    country?: string;
    companyLogo?: string;
    profileImg?: string;
}

const AVAILABLE_PERMISSIONS = [
    { value: "Approval", label: "Approval" },
    { value: "Create", label: "Create" },
    { value: "Editing", label: "Editing" },
    { value: "Deletion", label: "Deletion" },
];

const AVAILABLE_ROUTES = [
    { value: '/admin/create-user', label: "Admin Management" },
    { value: '/admin/packages', label: "Packages Management" },
    { value: '/admin/users', label: "Vendor Management" },
    { value: '/admin/promos', label: "Promo Management" },
    { value: '/admin/tickets', label: "Ticket Access" },
];

const EditAdminUser = () => {
    const { user } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [userData, setUserData] = useState<EditUserProps>({
        name: '',
        email: '',
        phone: '',
        utype: '',
        status: '',
        permissions: [],
        routes: [],
    });
    
    const [originalUserData, setOriginalUserData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFetching, setIsFetching] = useState<boolean>(true);

    useEffect(() => {
        if (id) {
            fetchUserData();
        }
    }, [id]);

    const fetchUserData = async () => {
        try {
            setIsFetching(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept':"application/json"
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data: UserData = await response.json();
            setOriginalUserData(data);
            console.log("first",data.routes)
            // Transform the data to match our form structure
            setUserData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                utype: data.utype || '',
                status: data.status || '',
                permissions: data.permissions?.map(p => p.name) || [],
                routes: data.routes?.map(r => r.name) || [],
            });
        } catch (error: any) {
            setError(error.message || 'Failed to fetch user data');
            toast.error('Failed to fetch user data');
        } finally {
            setIsFetching(false);
        }
    };

    const handlePermissionToggle = (permission: string) => {
        setUserData(prev => ({
            ...prev,
            permissions: prev.permissions.includes(permission)
                ? prev.permissions.filter(p => p !== permission)
                : [...prev.permissions, permission]
        }));
    };

    const removePermission = (permission: string) => {
        setUserData(prev => ({
            ...prev,
            permissions: prev.permissions.filter(p => p !== permission)
        }));
    };

    const handleRouteToggle = (route: string) => {
        setUserData(prev => ({
            ...prev,
            routes: prev.routes.includes(route)
                ? prev.routes.filter(r => r !== route)
                : [...prev.routes, route]
        }));
    };

    const removeRoute = (route: string) => {
        setUserData(prev => ({
            ...prev,
            routes: prev.routes.filter(r => r !== route)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        // Basic validation
        if (!userData.name || !userData.email || !userData.phone || !userData.utype || !userData.status) {
            setError('All fields are required');
            setIsLoading(false);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            setError('Please enter a valid email address');
            setIsLoading(false);
            return;
        }

        // Validation for SUBADMIN and ADMIN users - require at least one permission and route
        if ((userData.utype === 'SUBADMIN' || userData.utype === 'ADMIN')) {
            if (userData.permissions.length === 0) {
                setError('Please select at least one permission for Admin/Sub Admin users');
                setIsLoading(false);
                return;
            }
            if (userData.routes.length === 0) {
                setError('Please select at least one route for Admin/Sub Admin users');
                setIsLoading(false);
                return;
            }
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/admin/update-user${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user');
            }

            const data = await response.json();
            console.log('User updated:', data);
            
            // Show success message
            const successMessage = data.message || 'User updated successfully';
            setSuccess(successMessage);
            toast.success(successMessage);

            // Navigate back to admin users list after a short delay
            setTimeout(() => {
                navigate('/admin/users');
            }, 2000);
        } catch (e: any) {
            const errorMessage = e.message || 'An error occurred while updating the user';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/users');
    };

    if (isFetching) {
        return (
            <AdminDashboardLayout title="Edit Admin User" user={user}>
                <div className="flex justify-center items-center py-12">
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading user data...</span>
                    </div>
                </div>
            </AdminDashboardLayout>
        );
    }

    if (!originalUserData) {
        return (
            <AdminDashboardLayout title="Edit Admin User" user={user}>
                <div className="text-center py-12">
                    <div className="text-red-500 mb-4">User not found</div>
                    <Button onClick={handleCancel} variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </Button>
                </div>
            </AdminDashboardLayout>
        );
    }

    return (
        <AdminDashboardLayout title="Edit Admin User" user={user}>
            <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                    <Button onClick={handleCancel} variant="outline" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Admin User</h1>
                        <p className="text-gray-600">
                            Editing user: {originalUserData.name} ({originalUserData.email})
                        </p>
                    </div>
                </div>

                <Card className="max-w-5xl mx-auto p-6">
                    <CardContent>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                                <div>
                                    <Label className="block text-sm font-medium text-gray-700">Name</Label>
                                    <Input
                                        type="text"
                                        value={userData.name}
                                        onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-gray-700">Email</Label>
                                    <Input
                                        type="email"
                                        value={userData.email}
                                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-gray-700">Phone</Label>
                                    <Input
                                        type="tel"
                                        value={userData.phone}
                                        onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-gray-700">User Type</Label>
                                    <Select
                                        value={userData.utype}
                                        onValueChange={(value) => {
                                            setUserData({
                                                ...userData,
                                                utype: value,
                                                // Reset permissions and routes when user type changes to VENDOR
                                                permissions: value === 'VENDOR' ? [] : userData.permissions,
                                                routes: value === 'VENDOR' ? [] : userData.routes,
                                            });
                                        }}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder="Select User Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ADMIN">Admin</SelectItem>
                                            <SelectItem value="VENDOR">Vendor</SelectItem>
                                            <SelectItem value="SUBADMIN">Sub Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-gray-700">Status</Label>
                                    <Select
                                        value={userData.status}
                                        onValueChange={(value) => setUserData({ ...userData, status: value })}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="mt-1 w-full">
                                            <SelectValue placeholder="Select Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-gray-700">Member Since</Label>
                                    <Input
                                        type="text"
                                        value={new Date(originalUserData.createdAt).toLocaleDateString()}
                                        disabled
                                        className="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            {/* Routes Section - Only show if user type is SUBADMIN or ADMIN */}
                            {(userData.utype === 'SUBADMIN' || userData.utype === 'ADMIN') && (
                                <div className="space-y-4">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-3">
                                            Routes Access
                                        </Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {AVAILABLE_ROUTES.map((route) => (
                                                <div key={route.value} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`route-${route.value}`}
                                                        checked={userData.routes.includes(route.value)}
                                                        onCheckedChange={() => handleRouteToggle(route.value)}
                                                        disabled={isLoading}
                                                    />
                                                    <label
                                                        htmlFor={`route-${route.value}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {route.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Selected Routes Display */}
                                    {userData.routes.length > 0 && (
                                        <div>
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                                Selected Routes ({userData.routes.length})
                                            </Label>
                                            <div className="flex flex-wrap gap-2">
                                                {userData.routes.map((route) => {
                                                    const routeLabel = AVAILABLE_ROUTES.find(r => r.value === route)?.label || route;
                                                    return (
                                                        <Badge
                                                            key={route}
                                                            variant="secondary"
                                                            className="flex items-center gap-1 px-2 py-1"
                                                        >
                                                            {routeLabel}
                                                            <button
                                                                type="button"
                                                                onClick={() => removeRoute(route)}
                                                                disabled={isLoading}
                                                                className="ml-1 hover:text-red-500 disabled:cursor-not-allowed"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Permissions Section - Only show if user type is SUBADMIN or ADMIN */}
                            {(userData.utype === 'SUBADMIN' || userData.utype === 'ADMIN') && (
                                <div className="space-y-4">
                                    <div>
                                        <Label className="block text-sm font-medium text-gray-700 mb-3">
                                            Permissions
                                        </Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                            {AVAILABLE_PERMISSIONS.map((permission) => (
                                                <div key={permission.value} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`permission-${permission.value}`}
                                                        checked={userData.permissions.includes(permission.value)}
                                                        onCheckedChange={() => handlePermissionToggle(permission.value)}
                                                        disabled={isLoading}
                                                    />
                                                    <label
                                                        htmlFor={`permission-${permission.value}`}
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                    >
                                                        {permission.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Selected Permissions Display */}
                                    {userData.permissions.length > 0 && (
                                        <div>
                                            <Label className="block text-sm font-medium text-gray-700 mb-2">
                                                Selected Permissions ({userData.permissions.length})
                                            </Label>
                                            <div className="flex flex-wrap gap-2">
                                                {userData.permissions.map((permission) => {
                                                    const permissionLabel = AVAILABLE_PERMISSIONS.find(p => p.value === permission)?.label || permission;
                                                    return (
                                                        <Badge
                                                            key={permission}
                                                            variant="secondary"
                                                            className="flex items-center gap-1 px-2 py-1"
                                                        >
                                                            {permissionLabel}
                                                            <button
                                                                type="button"
                                                                onClick={() => removePermission(permission)}
                                                                disabled={isLoading}
                                                                className="ml-1 hover:text-red-500 disabled:cursor-not-allowed"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </button>
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {error && (
                                <div className="text-red-500 text-sm mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="text-green-500 text-sm mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                                    {success}
                                </div>
                            )}

                            <div className="flex justify-end gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-lime-600 hover:bg-lime-700"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update User'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminDashboardLayout>
    );
};

export default EditAdminUser;