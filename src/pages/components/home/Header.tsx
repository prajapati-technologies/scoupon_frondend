import { Menu, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Link } from "react-router-dom";
import logo from "../../../../public/logo.png";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 

  

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
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
                <Link to="/all-vendors" className="text-gray-700 hover:text-[#a0b830] font-medium transition-colors duration-200">
                  Find Vendors
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-gray-700 hover:text-[#a0b830] font-medium transition-colors duration-200">
                  For Vendors
                </Link>
              </li>
              <li>
                <Button className="bg-[#a0b830] hover:bg-[#8fa029] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              </li>
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
                to="/all-vendors"
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

           

            <li>
              <Button variant="default" asChild className="w-full">
                <Link to="/login" onClick={toggleMobileMenu}>
                  Login
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
