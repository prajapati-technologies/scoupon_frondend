import { useState, useCallback } from "react";
import { useAuth } from "../../useAuth";
import { DashboardLayout } from "./DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const AddGallery = () => {
    const { user } = useAuth();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        if (files.length > 10) {
            toast.error("You can only upload up to 10 images at once");
            return;
        }

        // Create preview URLs
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
        setSelectedFiles(prev => [...prev, ...files]);
    }, []);

    const removeImage = useCallback((index: number) => {
        URL.revokeObjectURL(previews[index]);
        setPreviews(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }, [previews]);

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Please select at least one image");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('images', file);
        });

        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/gallery/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            toast.success("Images uploaded successfully!");
            // Clear selections after successful upload
            previews.forEach(url => URL.revokeObjectURL(url));
            setPreviews([]);
            setSelectedFiles([]);
        } catch (error) {
            toast.error("Failed to upload images");
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <DashboardLayout title="Gallery Management" user={user}>
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Upload Gallery Images</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Upload Area */}
                        <div className="mb-8">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#a0b830] transition-colors">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    id="gallery-upload"
                                />
                                <label
                                    htmlFor="gallery-upload"
                                    className="cursor-pointer flex flex-col items-center"
                                >
                                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                                    <span className="text-gray-600 font-medium">
                                        Drop images here or click to upload
                                    </span>
                                    <span className="text-gray-400 text-sm mt-2">
                                        (Max 10 images at once)
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Preview Grid */}
                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                                {previews.map((preview, index) => (
                                    <div
                                        key={preview}
                                        className="relative group aspect-square rounded-lg overflow-hidden"
                                    >
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                title="Remove image"

                                                onClick={() => removeImage(index)}
                                                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Button */}
                        {selectedFiles.length > 0 && (
                            <div className="flex justify-end">
                                <Button
                                    onClick={handleUpload}
                                    disabled={isUploading}
                                    className="bg-[#a0b830] hover:bg-[#8fa029] text-white"
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>Upload {selectedFiles.length} Images</>
                                    )}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default AddGallery;
