import { Mail} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  
    return (
        <footer className="bg-gray-900 text-white py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4 text-[#a0b830]">Core Aeration</h2>
                        <p className="text-gray-300">Connecting local businesses with local customers</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-[#a0b830]">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="/" className="text-gray-300 hover:text-[#a0b830] transition-colors duration-200">Home</a></li>
                            <li><a href="#faq"  className="text-gray-300 hover:text-[#a0b830] transition-colors duration-200">FAQ</a></li>
                            <li><a href="/search-vendors" className="text-gray-300 hover:text-[#a0b830] transition-colors duration-200">Find Vendors</a></li>
                            <li><a href="/register" className="text-gray-300 hover:text-[#a0b830] transition-colors duration-200">For Vendors</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4 text-[#a0b830]">Contact Us</h3>
                        <p className="flex items-center text-gray-300 mb-2">
                            <Mail className="h-4 w-4 mr-2" />
                            Meekoslink@gmail.com
                        </p>
                        <ul className="space-y-2">
                            <li><Link to="/promos" className="text-gray-300 hover:text-[#a0b830] transition-colors duration-200">Get Promos</Link></li>
                            <li><Link to="/terms" className="text-gray-300 hover:text-[#a0b830] transition-colors duration-200">Terms</Link></li>
                            <li><Link to="/privacy-policy" className="text-gray-300 hover:text-[#a0b830] transition-colors duration-200">Privacy Policy</Link></li>
                            <li><Link to="/conduct-code" className="text-gray-300 hover:text-[#a0b830] transition-colors duration-200">Code Of Conduct</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-6 text-center">
                    <p className="text-gray-400">Developed and maintained by <a href="https://hostzack.com" target="_blank" rel="noopener noreferrer" className="text-[#a0b830] hover:text-[#a0b830] transition-colors duration-200">hostzack.com</a>. &copy; 2025 Meekos Links LLC. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
export default Footer;