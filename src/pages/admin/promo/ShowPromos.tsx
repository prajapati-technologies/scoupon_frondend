import { useState, useEffect } from "react";
import { AdminDashboardLayout } from "../layout/AdminDashboardLayout";
import { useAuth } from "../../../useAuth";
import { toast } from "react-toastify";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
    Edit,
    Trash2,
    Search,
    Calendar,
    Code,
    MapPin,
    ToggleLeft,
    ToggleRight,
    Plus,
    RefreshCw
} from "lucide-react";
import { Roles } from "../../../ProtectedRouteProps";
import * as moment from 'moment-timezone';

interface PromoData {
    id: number;
    title: string;
    description?: string;
    code: string;
    maxZipCode?: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    isSiteWide: boolean;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
    creator?: {
        id: number;
        name: string;
        email: string;
    };
}

const ShowPromos = () => {
    const { user } = useAuth();
    const [promos, setPromos] = useState<PromoData[]>([]);
    const [filteredPromos, setFilteredPromos] = useState<PromoData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
    const [toggleLoading, setToggleLoading] = useState<number | null>(null);

    useEffect(() => {
        fetchPromos();
    }, []);

    useEffect(() => {
        filterPromos();
    }, [promos, searchTerm]);

    const fetchPromos = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/promos`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch promos');
            }

            const data = await response.json();
            console.log("object promo", data)
            setPromos(data.data);
            setError(null);
        } catch (e: any) {
            setError(e.message || 'An error occurred while fetching promos');
            toast.error(e.message || 'Failed to fetch promos');
        } finally {
            setIsLoading(false);
        }
    };

    const filterPromos = () => {
        if (!searchTerm) {
            setFilteredPromos(promos);
            return;
        }

        const filtered = promos.filter(promo =>
            promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            promo.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPromos(filtered);
    };

    const handleToggleStatus = async (id: number) => {
        try {
            setToggleLoading(id);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/promos/${id}/toggle-status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to toggle promo status');
            }

            await fetchPromos();
            toast.success('Promo status updated successfully');
        } catch (e: any) {
            toast.error(e.message || 'Failed to toggle promo status');
        } finally {
            setToggleLoading(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this promo?')) {
            return;
        }

        try {
            setDeleteLoading(id);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/promos/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete promo');
            }

            await fetchPromos();
            toast.success('Promo deleted successfully');
        } catch (e: any) {
            toast.error(e.message || 'Failed to delete promo');
        } finally {
            setDeleteLoading(null);
        }
    };

    const formatDate = (date: Date) => {
        return moment.tz(date, 'America/Chicago').format('MMM DD, YYYY hh:mm A [CT]');
    };

    const isExpired = (endDate: Date) => {
        const nowCT = moment.tz('America/Chicago').toDate();
        return new Date(endDate) < nowCT;
    };

    const isUpcoming = (startDate: Date) => {
        const nowCT = moment.tz('America/Chicago').toDate();
        return new Date(startDate) > nowCT;
    };
    const hasPermission = (permissionName: Roles): boolean => {
        if (!user?.permissions) return false;
        return user.permissions.some(permission => permission.name === permissionName);
    };

    // Helper function to check if user can perform action
    const canPerformAction = (action: 'Editing' | 'Create' | 'Deletion' | 'Approval'): boolean => {
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

    if (isLoading) {
        return (
            <AdminDashboardLayout title="Admin Dashboard" user={user}>
                <div className="flex justify-center items-center h-64">
                    <RefreshCw className="animate-spin h-8 w-8 text-lime-600" />
                </div>
            </AdminDashboardLayout>
        );
    }

    return (
        <AdminDashboardLayout title="Admin Dashboard" user={user}>
            <div className="space-y-6">
                <Card className="p-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <h1 className="text-2xl font-bold">Promos Management</h1>
                        {canPerformAction('Create') && (
                            <Button
                                onClick={() => window.location.href = '/admin/create-promo'}
                                className="bg-lime-600 hover:bg-lime-700"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Promo
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {/* Search */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="text"
                                    placeholder="Search promos by title, code, or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm p-3 bg-red-50 border border-red-200 rounded-md mb-4">
                                {error}
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{promos.length}</div>
                                <div className="text-sm text-blue-600">Total Promos</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {promos.filter(p => p.isActive).length}
                                </div>
                                <div className="text-sm text-green-600">Active</div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-600">
                                    {promos.filter(p => isUpcoming(p.startDate)).length}
                                </div>
                                <div className="text-sm text-yellow-600">Upcoming</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                    {promos.filter(p => isExpired(p.endDate)).length}
                                </div>
                                <div className="text-sm text-red-600">Expired</div>
                            </div>
                        </div>

                        {/* Promos List */}
                        <div className="space-y-4">
                            {filteredPromos.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-500 text-lg">No promos found</div>
                                    <div className="text-gray-400 text-sm mt-2">
                                        {searchTerm ? 'Try adjusting your search terms' : 'Create your first promo'}
                                    </div>
                                </div>
                            ) : (
                                filteredPromos.map((promo) => (
                                    <Card key={promo.id} className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-semibold">{promo.title}</h3>
                                                    <div className="flex space-x-2">
                                                        <Badge variant={promo.isActive ? "default" : "secondary"}>
                                                            {promo.isActive ? "Active" : "Inactive"}
                                                        </Badge>
                                                        {promo.isSiteWide && (
                                                            <Badge variant="outline">Site Wide</Badge>
                                                        )}
                                                        {isExpired(promo.endDate) && (
                                                            <Badge variant="destructive">Expired</Badge>
                                                        )}
                                                        {isUpcoming(promo.startDate) && (
                                                            <Badge variant="secondary">Upcoming</Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                                                    <div className="flex items-center space-x-2">
                                                        <Code className="h-4 w-4" />
                                                        <span className="font-mono font-semibold">{promo.code}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(promo.startDate)}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{formatDate(promo.endDate)}</span>
                                                    </div>
                                                    {promo.maxZipCode && (
                                                        <div className="flex items-center space-x-2">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>Max Zip: {promo.maxZipCode}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {promo.description && (
                                                    <p className="text-gray-600 text-sm mb-2">{promo.description}</p>
                                                )}

                                                <div className="text-xs text-gray-500">
                                                    Created by {promo.creator?.name || 'Unknown'} on {formatDate(promo.createdAt)}
                                                </div>
                                            </div>

                                            <div className="flex space-x-2 ml-4">
                                                {canPerformAction('Editing') && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleToggleStatus(promo.id)}
                                                            disabled={toggleLoading === promo.id}
                                                        >
                                                            {toggleLoading === promo.id ? (
                                                                <RefreshCw className="h-4 w-4 animate-spin" />
                                                            ) : promo.isActive ? (
                                                                <ToggleRight className="h-4 w-4" />
                                                            ) : (
                                                                <ToggleLeft className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => window.location.href = `/admin/edit-promo/${promo.id}`}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </>
                                                )}

                                                {canPerformAction('Deletion') && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(promo.id)}
                                                        disabled={deleteLoading === promo.id}
                                                    >
                                                        {deleteLoading === promo.id ? (
                                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminDashboardLayout>
    );
};

export default ShowPromos;