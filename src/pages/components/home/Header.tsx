import { Menu, X, User, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../../../public/logo.png";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../../useAuth";
import axios from "axios";
import { toast } from "react-toastify";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLLIElement>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout.");
    }
    setIsProfileDropdownOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return "/";
    switch (user.utype) {
      case "SUPERADMIN":
      case "ADMIN":
      case "SUBADMIN":
        return "/admin/dashboard";
      case "VENDOR":
        return "/vendor/dashboard";
      default:
        return "/";
    }
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className="text-2xl font-bold text-[#a0b830] flex items-center space-x-3 hover:opacity-90 transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <img src={`${logo}`} alt="Core Aeration Logo" className="h-8 w-8" />
              <span className="text-2xl font-bold">Core Aeration</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex space-x-8 items-center">
              <li>
                <Link to="/vendors" className="text-gray-700 hover:text-[#a0b830] font-medium transition-colors duration-200">
                  Find Vendors
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-700 hover:text-[#a0b830] font-medium transition-colors duration-200">
                  For Vendors
                </Link>
              </li>

              {isAuthenticated && user ? (
                <li className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#a0b830] font-medium transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-[#a0b830] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm">{user.name}</span>
                  </button>

                  {/* Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                      <Link
                        to={getDashboardPath()}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/vendor/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                <li>
                  <Button className="bg-[#a0b830] hover:bg-[#8fa029] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </li>
              )}
            </ul>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t border-gray-200">
          <ul className="flex flex-col space-y-1 p-4">
            <li>
              <Link
                to="/"
                className="block text-gray-700 hover:text-[#a0b830] font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/vendors"
                className="block text-gray-700 hover:text-[#a0b830] font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                onClick={toggleMobileMenu}
              >
                Find Vendors
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="block text-gray-700 hover:text-[#a0b830] font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                onClick={toggleMobileMenu}
              >
                For Vendors
              </Link>
            </li>

            {isAuthenticated && user ? (
              <>
                <li className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="w-8 h-8 bg-[#a0b830] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </div>
                </li>
                <li>
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#a0b830] font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={toggleMobileMenu}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/vendor/dashboard"
                    className="flex items-center gap-2 text-gray-700 hover:text-[#a0b830] font-medium py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    onClick={toggleMobileMenu}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => { handleLogout(); toggleMobileMenu(); }}
                    className="flex items-center gap-2 text-red-600 font-medium py-2 px-3 rounded-lg hover:bg-red-50 transition-colors duration-200 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Button variant="default" asChild className="w-full">
                  <Link to="/login" onClick={toggleMobileMenu}>
                    Login
                  </Link>
                </Button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
