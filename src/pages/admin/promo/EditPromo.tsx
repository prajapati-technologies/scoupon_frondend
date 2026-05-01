import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminDashboardLayout } from "../layout/AdminDashboardLayout";
import { useAuth } from "../../../useAuth";
import { toast } from "react-toastify";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Textarea } from "../../../components/ui/textarea";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, RefreshCw, Save } from "lucide-react";
import * as moment from 'moment-timezone';

interface EditPromoProps {
    title: string;
    description: string;
    code: string;
    startDate: string;
    endDate: string;
    maxZipCode: number | null;
    isActive: boolean;
    isSiteWide: boolean;
}

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
    createdAt: Date;
    updatedAt: Date;
}

const EditPromo = () => {
    const { id } = useParams<{ id: string }>();
    console.log("object id",id);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [originalPromo, setOriginalPromo] = useState<PromoData | null>(null);
    const [promoData, setPromoData] = useState<EditPromoProps>({
        title: '',
        description: '',
        code: '',
        startDate: '',
        endDate: '',
        maxZipCode: null,
        isActive: true,
        isSiteWide: false,
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

    useEffect(() => {
        if (id) {
            fetchPromo();
        }
    }, [id]);

    const fetchPromo = async () => {
        try {
            setIsLoadingData(true);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/promos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch promo');
            }

            const data = await response.json();
            console.log("object promo",data);
            setOriginalPromo(data);
            
            setPromoData({
                title: data.title,
                description: data.description || '',
                code: data.code,
                startDate: formatDateForInput(new Date(data.startDate)),
                endDate: formatDateForInput(new Date(data.endDate)),
                maxZipCode:data.maxZipCode || null,
                isActive: data.isActive,
                isSiteWide: data.isSiteWide,
            });
        } catch (e: any) {
            setError(e.message || 'Failed to fetch promo');
            toast.error(e.message || 'Failed to fetch promo');
        } finally {
            setIsLoadingData(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        // Basic validation
        if (!promoData.title || !promoData.code || !promoData.startDate || !promoData.endDate) {
            setError('Title, code, start date, and end date are required');
            setIsLoading(false);
            return;
        }

        // Date validation
        const startDate = new Date(promoData.startDate);
        const endDate = new Date(promoData.endDate);
        if (startDate >= endDate) {
            setError('End date must be after start date');
            setIsLoading(false);
            return;
        }

        // Promo code validation
        if (promoData.code.length < 3) {
            setError('Promo code must be at least 3 characters long');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/promos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    ...promoData,
                    maxZipCode: promoData.maxZipCode || undefined
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update promo');
            }

            const data = await response.json();
            console.log('Promo updated:', data);
            
            const successMessage = data.message || 'Promo updated successfully';
            setSuccess(successMessage);
            toast.success(successMessage);
            
            // Refresh the promo data
            await fetchPromo();
        } catch (e: any) {
            const errorMessage = e.message || 'An error occurred while updating the promo';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/promos');
    };

    const formatDate = (date: Date) => {
        return moment.tz(date, 'America/Chicago').format('MMM DD, YYYY hh:mm A');
    };

    const formatDateForInput = (date: Date) => {
        return moment.tz(date, 'America/Chicago').format('YYYY-MM-DDTHH:mm');
    };

    if (isLoadingData) {
        return (
            <AdminDashboardLayout title="Admin Dashboard" user={user}>
                <div className="flex justify-center items-center h-64">
                    <RefreshCw className="animate-spin h-8 w-8 text-lime-600" />
                </div>
            </AdminDashboardLayout>
        );
    }

    if (!originalPromo) {
        return (
            <AdminDashboardLayout title="Admin Dashboard" user={user}>
                <div className="text-center py-12">
                    <div className="text-red-500 text-lg">Promo not found</div>
                    <Button onClick={handleCancel} className="mt-4">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Promos
                    </Button>
                </div>
            </AdminDashboardLayout>
        );
    }

    return (
        <AdminDashboardLayout title="Admin Dashboard" user={user}>
            <div className="space-y-6">
                <Card className="max-w-5xl mx-auto p-6">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">Edit Promo</h1>
                                <p className="text-gray-600 mt-1">
                                    Created at {formatDate(originalPromo.createdAt)}
                                </p>
                            </div>
                            <Button variant="outline" onClick={handleCancel}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Promos
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                                <div>
                                    <Label className="block text-sm font-medium text-gray-700">Title *</Label>
                                    <Input
                                        type="text"
                                        value={promoData.title}
                                        onChange={(e) => setPromoData({ ...promoData, title: e.target.value })}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        disabled={isLoading}
                                        required
                                        placeholder="Enter promo title"
                                    />
                                </div>
                                
                                <div>
                                    <Label className="block text-sm font-medium text-gray-700">Promo Code *</Label>
                                    <Input
                                        type="text"
                                        value={promoData.code}
                                        onChange={(e) => setPromoData({ ...promoData, code: e.target.value.toUpperCase() })}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        disabled={isLoading}
                                        required
                                        placeholder="PROMO2024"
                                        minLength={3}
                                    />
                                </div>
                                
                                <div>
                                    <Label className="block text-sm font-medium text-gray-700">Start Date * (Central Time)</Label>
                                    <Input
                                        type="datetime-local"
                                        value={promoData.startDate}
                                        onChange={(e) => setPromoData({ ...promoData, startDate: e.target.value })}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        disabled={isLoading}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Time zone: Central Time (CT)</p>
                                </div>
                                
                                <div>
                                    <Label className="block text-sm font-medium text-gray-700">End Date * (Central Time)</Label>
                                    <Input
                                        type="datetime-local"
                                        value={promoData.endDate}
                                        onChange={(e) => setPromoData({ ...promoData, endDate: e.target.value })}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        disabled={isLoading}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Time zone: Central Time (CT)</p>
                                </div>

                                <div>
                                    <Label className="block text-sm font-medium text-gray-700">Max Zip Code</Label>
                                    <Input
                                        type="number"
                                        value={promoData.maxZipCode || ''}
                                        onChange={(e) => setPromoData({ 
                                            ...promoData, 
                                            maxZipCode: e.target.value ? parseInt(e.target.value) : null 
                                        })}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        disabled={isLoading}
                                        placeholder="Enter max zip code"
                                        min={1}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label className="block text-sm font-medium text-gray-700">Description</Label>
                                <Textarea
                                    value={promoData.description}
                                    onChange={(e) => setPromoData({ ...promoData, description: e.target.value })}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    disabled={isLoading}
                                    placeholder="Enter promo description"
                                    rows={3}
                                />
                            </div>

                            {/* Checkboxes Section */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isActive"
                                        checked={promoData.isActive}
                                        onCheckedChange={(checked) => setPromoData({ ...promoData, isActive: checked as boolean })}
                                        disabled={isLoading}
                                    />
                                    <label
                                        htmlFor="isActive"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        Active
                                    </label>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isSiteWide"
                                        checked={promoData.isSiteWide}
                                        onCheckedChange={(checked) => setPromoData({ ...promoData, isSiteWide: checked as boolean })}
                                        disabled={isLoading}
                                    />
                                    <label
                                        htmlFor="isSiteWide"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                    >
                                        Site Wide
                                    </label>
                                </div>
                            </div>
                            
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
                            
                            <div className="flex justify-end space-x-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Update Promo
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminDashboardLayout>
    );
};

export default EditPromo;