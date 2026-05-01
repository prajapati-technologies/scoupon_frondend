import Footer from "./components/home/Footer";
import Header from "./components/home/Header";
const CoreAerationCaution = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">
                <div className="mt-10 max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Core Aeration Caution</h1>
                    <p className="mb-6 text-gray-700 leading-relaxed">
                        Core aeration is a great way to rejuvenate your lawn—but only if done correctly. Mistakes in timing or technique can damage your turf instead of helping it. Here’s what to avoid:
                    </p>
                    <hr className="my-6" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mistake #1: Poor Timing</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                        <li><strong>Too dry or too wet?</strong> Soil that's bone-dry won't allow deep core aeration, and soggy soil can clog the machine or tear the turf.</li>
                        <li><strong>During drought or extreme heat?</strong> Avoid aerating when your lawn is already under stress—it could worsen the damage.</li>
                        <li><strong>Wrong season?</strong>
                            <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                                <li>Cool-season grasses: Core aerate in early fall or spring</li>
                                <li>Warm-season grasses: Core aerate in late spring or early summer</li>
                            </ul>
                            Never core aerate when your grass is dormant.
                        </li>
                    </ul>
                    <hr className="my-6" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mistake #2: Improper Equipment or Setup</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                        <li><strong>Using a spike aerator:</strong> These can compact soil rather than loosen it. Always use a core aerator that removes actual plugs of soil.</li>
                        <li><strong>Skipping pre-watering:</strong> Light watering the day before helps the tines penetrate better—but don’t soak the lawn.</li>
                        <li><strong>Forgetting to mark obstacles:</strong> Flag sprinkler heads, valve boxes, and anything underground to avoid damage.
                            <ul className="list-disc list-inside ml-5 mt-1 space-y-1">
                                <li><strong>Tip:</strong> We recommend calling in a public utility locator company before starting any job. Private utilities are different than public utilities.</li>
                            </ul>
                        </li>
                        <li><strong>Rushing the job:</strong> Going too fast can damage both the turf and your aerator. Take your time.</li>
                    </ul>
                    <hr className="my-6" />
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mistake #3: Neglecting Aftercare</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                        <li><strong>Heavy foot traffic too soon:</strong> Stay off the lawn for a few days to allow the soil to settle and recover.</li>
                        <li><strong>Removing the soil plugs:</strong> Let them decompose naturally—they feed your lawn with nutrients.</li>
                        <li><strong>Mowing too soon or too short:</strong> Give grass seed time to establish and keep your mower height higher during the first mow.</li>
                        <li><strong>Skipping topdressing:</strong> Applying a light layer of soil post core aeration helps smooth the lawn and improve long-term soil quality.</li>
                    </ul>
                </div>
            </main>
            <Footer />
        </div>
    );
};
export default CoreAerationCaution;