import aboutImg from "../../../../public/6327575.jpg";
const About = () => {
   

    return (
        <>
            <section className="py-16 bg-white" id="about">
                <div className="container mx-auto px-4">
                    <div className="about-section max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="order-2 md:order-1">
                                <h2 className="text-4xl font-bold text-black mb-8">About Core Aeration</h2>
                                <p className="text-gray-900 text-lg leading-relaxed">
                                    Core aeration is one of the most effective ways to revitalize your lawn. It involves removing small plugs of soil to improve the flow of air, water, and nutrients to the grass roots. Over time, lawns become compacted and develop a thick layer of thatch, both of which limit root growth and weaken the turf. Core aeration solves these problems—naturally.
                                </p>
                            </div>
                            <div className="order-1 md:order-2">
                                <div className="relative rounded-lg overflow-hidden shadow-xl">
                                    <img 
                                        src={aboutImg} 
                                        alt="Lawn Care Illustration" 
                                        className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

           
        </>
    );
};

export default About;