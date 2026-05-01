import { ChangeEvent, useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Checkbox } from "../../../components/ui/checkbox";
import { useAuth } from "../../../useAuth";
interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
    [key: string]: string | undefined;
}
interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
        status?: number;
    };
}
const RegisterForm = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false
    });
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value
        });

        // Clear error for this field when user starts typing
        if (errors[id]) {
            setErrors({
                ...errors,
                [id]: ""
            });
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData({
            ...formData,
            agreeToTerms: checked
        });

        if (errors.agreeToTerms) {
            setErrors({
                ...errors,
                agreeToTerms: ""
            });
        }
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};

        // Validate first name
        if (!formData.firstName.trim()) {
            newErrors.firstName = "First name is required";
        }

        // Validate last name
        if (!formData.lastName.trim()) {
            newErrors.lastName = "Last name is required";
        }

        // Validate phone
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone is required";
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }

        // Validate password
        const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Password must be at least 8 characters with a number and special character";
        }

        // Validate confirm password
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Validate terms agreement
        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = "You must agree to the terms";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
                name: formData.firstName + " " + formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            });

            if (response.status === 201 || response.status === 200) {
                // Check if response contains token and user data
                if (response.data?.access_token && response.data?.user) {
                    // Update auth state using the hook
                    useAuth.getState().login(response.data.user, response.data.access_token);
                    
                    toast.success("Registration successful!",{
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    
                    // Redirect based on user type
                    switch(response.data.user.utype) {
                        case "ADMIN":
                            navigate("/admin/dashboard");
                            break;
                        case "VENDOR":
                            navigate("/vendor/profile/update");
                            break;
                        default:
                            navigate("/");
                    }
                } else {
                    // Fallback to old behavior if response format doesn't match
                    toast.success("Registration successful!",{
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                    navigate("/login");
                }
            }
        } catch (error) {
            console.error("Registration error:", error);

            const apiError = error as ApiError;

            if (apiError.response?.data?.message) {
                toast.error(apiError.response.data.message);
            } else if (apiError.response?.status === 409) {
                toast.error("A user with this email already exists");
            } else {
                toast.error("Registration failed. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-grow container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto">
                <Link to="/" className="inline-flex items-center text-sm text-[#a0b830] mb-6 hover:text-purple-800 transition duration-300">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Home
                </Link>

                <Card className="shadow-lg rounded-lg border border-gray-200">
                    <CardHeader className="space-y-1 text-center">
                        <div className="flex items-center justify-center mb-2">
                            <div className="bg-purple-100 p-3 rounded-full shadow-md">
                                <UserPlus className="h-8 w-8 text-[#a0b830]" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
                        <CardDescription className="text-gray-600">
                            Enter your information to register for VendorLocator
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {/* First and Last Name */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                                    <Input
                                        id="firstName"
                                        placeholder="First Name"
                                        className={`border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 ${errors.firstName ? 'border-red-500' : ''}`}
                                        value={formData.firstName}
                                        onChange={handleChange}
                                    />
                                    {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        placeholder="Last Name"
                                        className={`border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 ${errors.lastName ? 'border-red-500' : ''}`}
                                        value={formData.lastName}
                                        onChange={handleChange}
                                    />
                                    {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="Phone Number"
                                    className={`border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 ${errors.phone ? 'border-red-500' : ''}`}
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Email Address"
                                    className={`border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 ${errors.email ? 'border-red-500' : ''}`}
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    className={`border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 ${errors.password ? 'border-red-500' : ''}`}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-gray-500">Password must be at least 8 characters with a number and special character</p>
                                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm Password"
                                    className={`border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onCheckedChange={handleCheckboxChange}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="agreeToTerms"
                                        className="text-sm "
                                    >
                                        <Link to="/terms" className="text-green-500">Accept terms & conditions</Link> and <Link to="/privacy-policy" className="text-green-500">Privacy Policy</Link>
                                    </label>
                                </div>
                            </div>
                            {errors.agreeToTerms && <p className="text-xs text-red-500">{errors.agreeToTerms}</p>}
                        </CardContent>
                        <CardFooter className="mt-2">
                            <Button
                                type="submit"
                                className="w-full bg-[#a0b830] hover:bg-[#8fa029] text-white transition duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? "Creating Account..." : "Create Account"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#a0b830] font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </main>
        
    );
};

export default RegisterForm;