import { useState } from "react";
import { AdminDashboardLayout } from "../layout/AdminDashboardLayout";
import { useAuth } from "../../../useAuth";
import { toast } from "react-toastify";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Badge } from "../../../components/ui/badge";
import { X } from "lucide-react";

interface CreateUserProps {
    name: string;
    email: string;
    phone: string;
    utype: string;
    status: string;
    password: string;
    permissions: string[];
    routes: string[];
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

const CreateUser = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<CreateUserProps>({
        name: '',
        email: '',
        phone: '',
        utype: '',
        status: '',
        password: '',
        permissions: [],
        routes: [],
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
        if (!userData.name || !userData.email || !userData.utype || !userData.status || !userData.password) {
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

        // Password validation
        if (userData.password.length < 6) {
            setError('Password must be at least 6 characters long');
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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/admin/create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create user');
            }

            const data = await response.json();
            console.log('User created:', data);
            
            // Show success message
            const successMessage = data.message || 'User created successfully';
            setSuccess(successMessage);
            toast.success(successMessage);

            // Reset form
            setUserData({
                name: '',
                email: '',
                phone: '',
                utype: '',
                status: '',
                password: '',
                permissions: [],
                routes: [],
            });
        } catch (e: any) {
            const errorMessage = e.message || 'An error occurred while creating the user';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminDashboardLayout title="Admin Dashboard" user={user}>
            <div className="space-y-6">
                <Card className="max-w-5xl mx-auto p-6">
                    <CardHeader>
                        <h1 className="text-2xl font-bold">Create User</h1>
                    </CardHeader>
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
                                        
                                    />
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-gray-700">Password</Label>
                                    <Input
                                        type="password"
                                        value={userData.password}
                                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        disabled={isLoading}
                                        required
                                        minLength={6}
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
                                                // Reset permissions and routes when user type changes
                                                permissions: [],
                                                routes: [],
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
                                            <SelectItem value="INACTIVE">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
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

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminDashboardLayout>
    );
};

export default CreateUser;