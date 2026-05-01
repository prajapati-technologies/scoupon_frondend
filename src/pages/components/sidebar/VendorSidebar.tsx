import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { useAuth } from "../../../useAuth";
import { LayoutDashboard, Package, ShoppingCart, LogOutIcon, Ticket, Lock, Badge, Globe } from "lucide-react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VendorSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout. Please try again.');
        }
    };
    const location = useLocation();

    const isActiveRoute = (route: string) => {
        return location.pathname === route;
    };

    return (
        <div className="flex h-full flex-col">
            <div className="border-b px-6 py-4">
                <h2 className="text-lg font-semibold">Menu</h2>
            </div>

            <nav className="flex-1 px-2 py-2 scroll-pb-4 overflow-y-auto">
                <div className="space-y-1">
                    <Button
                        variant={isActiveRoute("/vendor/dashboard") ? "secondary" : "ghost"}
                        className="w-full justify-start"
                    >
                        <Link to="/vendor/dashboard" className="flex items-center">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            My Profile
                        </Link>
                    </Button>
                    {user && user.packageActive === "active" && (
                        <Button
                            variant={isActiveRoute("/my-ads") ? "secondary" : "ghost"}
                            className="w-full justify-start"
                        >
                            <Link to="/my-ads" className="flex items-center">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                My Ads
                            </Link>
                        </Button>
                    )}

                    <Button
                        variant={isActiveRoute("/vendor/subscriptions") ? "secondary" : "ghost"}
                        className="w-full justify-start"
                    >
                        <Link to="/vendor/subscriptions" className="flex items-center">
                            <Package className="mr-2 h-4 w-4" />
                            Packages
                        </Link>
                    </Button>

                    <Button
                        variant={isActiveRoute("/vendor/transactions") ? "secondary" : "ghost"}
                        className="w-full justify-start"
                    >
                        <Link to="/vendor/transactions" className="flex items-center">
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            Transaction</Link>
                    </Button>

                    <Button
                        variant={isActiveRoute("/vendor/support-chats") ? "secondary" : "ghost"}
                        className="w-full justify-start"
                    >
                        <Link to="/vendor/support-chats" className="flex items-center">
                        <Ticket className="mr-2 h-4 w-4" />
                        Support Ticket</Link>
                    </Button>
                    {user  && (
                        <Button
                            variant={isActiveRoute("/vendor/certification-badge") ? "secondary" : "ghost"}
                            className="w-full justify-start"
                        >
                            <Link to="/vendor/certification-badge" className="flex items-center">
                                <Badge className="mr-2 h-4 w-4" />
                                Certified Vendor Badge
                            </Link>
                        </Button>
                    )}

                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                    >
                        <Link 
                            to="/" 
                            className="flex items-center"
                            onClick={() => sessionStorage.setItem('stayOnPublic', 'true')}
                        >
                            <Globe className="mr-2 h-4 w-4" />
                            Visit Website
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                    >
                        <Link to="/all-vendors" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            Find Vendors
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                    >
                        <Link to="/search-vendors" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            Search Vendors
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                    >
                        <Link to="/terms" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            Terms & Conditions
                        </Link>
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full justify-start"
                    >
                        <Link to="/privacy-policy" className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            Privacy Policy
                        </Link>
                    </Button>

                    <Button
                        variant={isActiveRoute("/vendor/reset-password") ? "secondary" : "ghost"}
                        className="w-full justify-start"
                    >
                        <Link to="/vendor/reset-password" className="flex items-center">
                            <Lock className="mr-2 h-4 w-4" />
                            Reset Password</Link>
                    </Button>

                </div>
            </nav>

            <div className="border-t p-4">
                <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                        <AvatarImage src="/placeholder.png" alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                </div>
                <Button
                    variant="destructive"
                    className="w-full justify-start text-white hover:text-white"
                    onClick={handleLogout}
                >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );
}

export default VendorSidebar;