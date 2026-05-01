import { ArrowLeft, KeyRound } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

interface ForgetFormData {
    email: string;
}

const ForgetForm = () => {
    const [formData, setFormData] = useState<ForgetFormData>({
        email: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string>("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const onSubmit = async (data: ForgetFormData) => {
        // Reset error state
        setError("");
        
        // Validate email
        if (!data.email) {
            setError("Email is required");
            return;
        }
        
        if (!validateEmail(data.email)) {
            setError("Please enter a valid email address");
            return;
        }

        setIsSubmitting(true);
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/forgot-password`, data);
            
            // When using axios, the code will only reach here if the response was successful
            toast.success(response.data.message || "Password reset link sent successfully");
            
            // The navigation should happen AFTER we get the userId from the response
            const userId = response.data.data;
            
            // Store userId in localStorage as a backup in case the redirect doesn't work
            if (userId) {
                localStorage.setItem('passwordResetUserId', userId);
            }
            
            console.log("Password reset link sent successfully");
            
            // Small delay to allow the toast to be seen
            toast.success("Password reset link sent successfully");
            
        } catch (error: any) {
            console.error("Failed to send reset link");
            const errorMessage = error.response?.data?.message || "Failed to send reset link";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="flex-grow container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto">
                <Link to="/login" className="inline-flex items-center text-sm text-[#a0b830] mb-6 hover:text-purple-800 transition duration-300">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Login
                </Link>
                
                <Card className="shadow-lg rounded-lg border border-gray-200">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <div className="bg-purple-100 p-3 rounded-full shadow-md">
                                <KeyRound className="h-8 w-8 text-[#a0b830]" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                        <CardDescription className="text-gray-600">
                            Enter your email and we'll send you a password reset link
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                name="email" 
                                type="email" 
                                value={formData.email} 
                                onChange={handleInputChange} 
                                placeholder="john.doe@example.com" 
                                className="border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200" 
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full bg-[#a0b830] hover:bg-[#a0b830] text-white transition duration-300" 
                            onClick={() => onSubmit(formData)}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Sending..." : "Reset Password"}
                        </Button>
                    </CardFooter>
                </Card>
                
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link to="/login" className="text-[#a0b830] font-medium hover:underline">
                            Back to login
                        </Link>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </main>
    );
};

export default ForgetForm;