import { useState } from "react";
import { AdminDashboardLayout } from "../layout/AdminDashboardLayout";
import { useAuth } from "../../../useAuth";
import { toast } from "react-toastify";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Textarea } from "../../../components/ui/textarea";
import * as moment from 'moment-timezone';

interface CreatePromoProps {
    title: string;
    description: string;
    code: string;
    startDate: string;
    endDate: string;
    maxZipCode: number | null;
    isActive: boolean;
    isSiteWide: boolean;
    createdBy: number;
}

const CreatePromo = () => {
    const { user } = useAuth();
    const [promoData, setPromoData] = useState<CreatePromoProps>({
        title: '',
        description: '',
        code: '',
        startDate: moment.tz('America/Chicago').format('YYYY-MM-DDTHH:mm'),
        endDate: moment.tz('America/Chicago').add(1, 'week').format('YYYY-MM-DDTHH:mm'),
        maxZipCode: null,
        isActive: true,
        isSiteWide: false,
        createdBy: user?.id || 0
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/promos`, {
                method: 'POST',
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
                throw new Error(errorData.message || 'Failed to create promo');
            }

            const data = await response.json();
            console.log('Promo created:', data);

            const successMessage = data.message || 'Promo created successfully';
            setSuccess(successMessage);
            toast.success(successMessage);

            // Reset form
            setPromoData({
                title: '',
                description: '',
                code: '',
                startDate: moment.tz('America/Chicago').format('YYYY-MM-DDTHH:mm'),
                endDate: moment.tz('America/Chicago').add(1, 'week').format('YYYY-MM-DDTHH:mm'),
                maxZipCode: null,
                isActive: true,
                isSiteWide: false,
                createdBy: user?.id || 0
            });
        } catch (e: any) {
            const errorMessage = e.message || 'An error occurred while creating the promo';
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
                        <h1 className="text-2xl font-bold">Create Promo</h1>
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

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? 'Creating...' : 'Create Promo'}
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminDashboardLayout>
    );
};

export default CreatePromo;