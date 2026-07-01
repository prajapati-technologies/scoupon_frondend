import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import Search from "./Search";
import hero from "../../../../public/hero.jpg";
const Hero = () => {
    return (
        <section className="relative bg-cover bg-center pt-20 pb-5" style={{ backgroundImage: `url(${hero})` }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center h-full">
                <div className="max-w-2xl text-center">
                    <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">Find Local Vendors In Your Area</h2>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 drop-shadow-lg">Connect with trusted local businesses serving your neighborhood</p>
                    <Search />
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Button className='bg-[#a0b830] hover:bg-[#a0b830] transition duration-300' asChild>
                            <Link to="/vendors">Browse All Vendors</Link>
                        </Button>
                        <Button className="text-white bg-[#a0b830] hover:bg-[#a0b830] transition duration-300" asChild>
                            <Link to="/register">Register Your Business</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Hero;