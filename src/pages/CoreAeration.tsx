import Footer from "./components/home/Footer";
import Header from "./components/home/Header";

const CoreAeration = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">
                <div className="mt-10 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Core Aeration: The Secret to a Healthier Lawn</h1>
                    <p className="mb-6 text-gray-700 leading-relaxed">
                        Core aeration is one of the most effective ways to revitalize your lawn. It involves removing small plugs of soil to improve the flow of air, water, and nutrients to the grass roots. Over time, lawns become compacted and develop a thick layer of thatch, both of which limit root growth and weaken the turf. Core aeration solves these problems—naturally.
                    </p>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Benefits of a Healthier Lawn:</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Soil Filtration:</strong> Lawns improve soil filtration, helping to purify rainwater as it seeps into the ground.</li>
                        <li><strong>Oxygen Producer:</strong> Healthy grass produces enough oxygen to sustain a family of four for an entire year. (Dr. Thomas L. Watschke, Pennsylvania State University)</li>
                        <li><strong>Cooling Effect:</strong> The combined front lawns of just eight average homes can have the same cooling effect as 70 tons of air conditioning. (Maryland Turfgrass Study 1996)</li>
                        <li><strong>Reducing Dust and Dirt:</strong> Grass captures an estimated 12 million tons of dust and dirt from the atmosphere each year. (Dr. Thomas L. Watschke, Pennsylvania State University)</li>
                        <li><strong>Carbon Producer:</strong> Lawns act as a carbon sink—if grass clippings are left to decompose naturally, U.S. lawns could store up to 37 billion pounds of carbon annually. (Christina Milesi, NASA Ames Research Center 2006)</li>
                    </ul>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Core Aeration Matters:</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Relieves Soil Compaction:</strong> Compacted soil prevents water, oxygen, and nutrients from reaching the roots. Core aeration opens up the soil, giving your grass room to breathe and grow.</li>
                        <li><strong>Improves Water and Nutrient Absorption:</strong> The holes left by core aeration provide a seed bed and an entry point for the nutrients, air, and water, as well as providing a bed for overseeding. It also allows for deeper penetration of water and fertilizer, improving efficiency and reducing waste.</li>
                        <li><strong>Reduces Thatch Build-Up:</strong> Thatch is a layer of dead organic matter that blocks essential resources. Core aeration helps break it down and encourages microbial activity.</li>
                        <li><strong>Prevents Water Pooling and Runoff:</strong> Aerated lawns absorb water more effectively, reducing puddling and erosion.</li>
                        <li><strong>Boosts Drought Resistance:</strong> Deeper and thicker roots make your lawn more resilient during dry, hot conditions.</li>
                    </ul>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">How Core Aeration Works:</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Equipment Used:</strong> A core aerator uses hollow tines to remove 2–4 inch plugs of soil from the lawn.</li>
                        <li><strong>After Core Aeration:</strong> The soil plugs are left on the lawn to naturally break down and return nutrients to the soil.</li>
                        <li><strong>How Often to Core Aerate:</strong>
                            <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                                <li>Clay soil or high-traffic lawns: 2 times per year</li>
                                <li>Loamy or moderate-traffic lawns: 2 times per year</li>
                                <li>Sandy or low-traffic lawns: 1 time per year</li>
                            </ul>
                        </li>
                        <li>Core aeration is proven especially effective if it is done in conjunction with overseeding and fertilizing as part of a complete lawn care program.</li>
                    </ul>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Best Time to Aerate:</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                        <li>Cool-season grasses: Early spring or fall</li>
                        <li>Warm-season grasses: Late spring or early fall</li>
                        <li><strong>Tip:</strong> Core aerate when the soil is moist—but not wet—for best results.</li>
                    </ul>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Is Core Aeration Really Worth It?</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Absolutely. Without it, compacted soil and thatch buildup can choke your lawn, leaving it thin, stressed, and discolored—especially late in the season. Core aeration restores healthy airflow, encourages strong and thicker root development, and sets the foundation for a thick, lush lawn.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CoreAeration;

