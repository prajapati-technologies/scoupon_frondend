import { useState } from "react";
import { useAuth } from "../../useAuth";
import { AdminDashboardLayout } from "./layout/AdminDashboardLayout";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Card } from "../../components/ui/card";
import { ShieldCheck } from "lucide-react";
import { Label } from "../../components/ui/label";
import { PasswordInput } from "../../components/ui/password-input";
import { Button } from "../../components/ui/button";
interface ResetFormData {
    password: string;
    confirmPassword: string;
}
const AdminDashbaord = () => {
  const { user } = useAuth();
 
  const [formData, setFormData] = useState<ResetFormData>({
    password: "",
    confirmPassword: ""
});
const [error, setError] = useState<string>("");

const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing again
    if (error) setError("");
};

const validateForm = (): boolean => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
    }

    // Check password strength (at least 8 characters with a number and special character)
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(formData.password)) {
        setError("Password must be at least 8 characters with a number and special character");
        return false;
    }

    return true;
};

const onSubmit = async () => {
    if (!validateForm()) return;

    try {
        // Only send the password field to the backend
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password/${user?.id}`, {
                password: formData.password
        });
        
        if (response.status === 201) {
            toast.success("Reset Your Password Now.");
                window.location.href = '/admin/dashboard';
          
        } else {
            toast.error(response.data.message);
        }
    } catch (error: any) {
        toast.error(error.response?.data?.message || "An error occurred");
        console.log(error);
    }
};
  return (
    <AdminDashboardLayout title="Admin Dashboard" user={user}>
      <div className="space-y-6">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
     <Card className="w-full max-w-md mx-auto">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-2">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <ShieldCheck className="h-8 w-8 text-[#a0b830]" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
                        <CardDescription className="text-center">
                            Create a new password for your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <PasswordInput 
                                id="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleInputChange} 
                            />
                            <p className="text-xs text-gray-500">Password must be at least 8 characters with a number and special character</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <PasswordInput 
                                id="confirmPassword" 
                                name="confirmPassword" 
                                value={formData.confirmPassword} 
                                onChange={handleInputChange} 
                            />
                        </div>
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full bg-[#a0b830] hover:bg-[#a0b830] text-white transition duration-300" 
                            onClick={onSubmit}
                        >
                            Reset Password
                        </Button>
                    </CardFooter>
                </Card>
                <ToastContainer /></div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminDashbaord;