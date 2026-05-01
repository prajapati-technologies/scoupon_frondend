import Footer from "./components/home/Footer";
import Header from "./components/home/Header";

const CoreAerationTips = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">
                <div className="mt-10 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Core Aeration: Safety Tips & Best Practices</h1>
                    <p className="mb-6 text-gray-700 leading-relaxed">
                        Core aeration improves lawn health—but it’s essential to do it safely and correctly. Here are 8 key precautions to protect your lawn, equipment, and yourself:
                    </p>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Mark Underground Hazards</h2>
                    <p className="text-gray-700 mb-4">
                        Before you begin, clearly mark all sprinkler heads, utility lines, invisible fence, and valve boxes. This helps prevent accidental damage and costly repairs.
                    </p>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Check Soil Moisture</h2>
                    <p className="text-gray-700 mb-4">
                        Core aerate when the soil is moist, not dry or soggy. Dry soil is too hard for the tines to penetrate, while super wet soil can clog the machine.
                    </p>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. Avoid Core Aerating in Heat or Drought</h2>
                    <p className="text-gray-700 mb-4">
                        Extreme heat or dry conditions can stress your grass. Aim to core aerate during mild weather and when your lawn is actively growing.
                    </p>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Wear Eye Protection</h2>
                    <p className="text-gray-700 mb-4">
                        Always wear safety glasses or goggles while operating the core aerator to shield your eyes from flying debris.
                    </p>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Watch for Obstacles</h2>
                    <p className="text-gray-700 mb-4">
                        Never run the core aerator over sidewalks, driveways, or visible obstacles. Raise the tines when crossing hard surfaces and avoid rocks, tree roots, or sprinkler heads.
                    </p>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Handle Equipment Carefully</h2>
                    <p className="text-gray-700 mb-4">
                        Core aerators are heavy machines with moving parts. Use proper technique, follow all safety instructions, and avoid loose clothing.
                    </p>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Set the Correct Depth and Spacing</h2>
                    <p className="text-gray-700 mb-4">
                        Aim for plugs 2–4 inches deep and 3–6 inches apart. This provides effective aeration without damaging the lawn.
                    </p>

                    <hr className="my-6" />

                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Make Overlapping Passes</h2>
                    <p className="text-gray-700 mb-4">
                        For compacted areas, make a second pass at a 90-degree angle to the first to ensure even coverage.
                    </p>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CoreAerationTips;
