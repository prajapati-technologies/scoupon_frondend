import { useState } from "react";

const FAQ = () => {
    const [activeQuestion, setActiveQuestion] = useState<number | null>(null);

    const faqData = [
        {
            question: "What is core aeration?",
            answer: "Core aeration is a lawn care process that removes small plugs of soil from the ground. This relieves compaction, improves airflow, and allows water and nutrients to reach grass roots more effectively."
        },
        {
            question: "How do I know if my lawn needs core aeration?",
            answer: "If your lawn feels hard, drains poorly, develops bare patches, or has heavy foot traffic or thick thatch, it's likely time to core aerate. Lawns with clay soil are especially prone to compaction. Each growing season is recommended."
        },
        {
            question: "When is the best time to core aerate my lawn?",
            answer: "• Cool-season grasses (like Kentucky bluegrass or fescue): Early spring or fall\n• Warm-season grasses (like Bermuda or zoysia): Late spring to early summer\n• Avoid core aerating during peak stress periods like mid-summer heat for cool-season grasses."
        },
        {
            question: "How often should I aerate my lawn?",
            answer: "• Clay soil or high foot traffic: Twice per year each growing season\n• Loamy or moderate use: Twice per year each growing season\n• Low-traffic lawns: Every 1-2 times per year\n• Sandy lawns: Microbial aeration is recommended 2 times per year"
        },
        {
            question: "What happens to the soil plugs after core aeration?",
            answer: "The small plugs of soil and thatch will naturally break down over time. As they decompose, they return valuable nutrients back to the lawn."
        },
        {
            question: "Can I mow or fertilize after core aeration?",
            answer: "Yes! In fact, core aerating before fertilizing helps nutrients reach the root zone more effectively. Wait a day or two before mowing to allow the soil to settle."
        },
        {
            question: "What are the benefits of a healthy lawn?",
            answer: "• Healthy grass produces enough oxygen to sustain a family of four for an entire year\n• Lawns improve soil filtration, helping to purify rainwater\n• The combined front lawns of eight average homes can have the same cooling effect as 70 tons of air conditioning\n• Grass captures an estimated 12 million tons of dust and dirt annually\n• Lawns act as a carbon sink—U.S. lawns could store up to 37 billion pounds of carbon annually"
        },
        {
            question: "What should I avoid when core aerating?",
            answer: "Key things to avoid:\n• Poor timing: Don't aerate when soil is too dry/wet or during drought\n• Improper equipment: Always use a core aerator, not a spike aerator\n• Neglecting preparation: Mark obstacles and utilities before starting\n• Poor aftercare: Avoid heavy traffic and let soil plugs decompose naturally"
        }
    ];

    const toggleQuestion = (index: number) => {
        setActiveQuestion(activeQuestion === index ? null : index);
    };
    return (
        <>
            {/* <section className="py-16 bg-white mt-10">
                <div className="containerId mx-auto px-4">
                    
                        <div className="hero-section">
                            <h1 className="text-4xl font-bold text-[#2C3E50] mb-12 text-center">Core Aeration: The Secret to a Healthier Lawn</h1>
                            <p className="hero-subtitle">Transform your lawn with this proven technique that improves soil health, enhances root growth, and creates the foundation for a lush, thriving landscape.</p>
                        </div>

                        <div className="process-section">
                            <p className="card-content">Core aeration is one of the most effective ways to revitalize your lawn. It involves removing small plugs of soil to improve the flow of air, water, and nutrients to the grass roots. Over time, lawns become compacted and develop a thick layer of thatch, both of which limit root growth and weaken the turf. Core aeration solves these problems—naturally.</p>
                        </div>

                        <h2 className="section-title">Benefits of a Healthier Lawn</h2>
                        <div className="benefits-grid">
                            <div className="benefit-item">
                                <span className="benefit-icon">💧</span>
                                <div className="benefit-title">Soil Filtration</div>
                                <div className="benefit-description">Lawns improve soil filtration, helping to purify rainwater as it seeps into the ground.</div>
                            </div>
                            <div className="benefit-item">
                                <span className="benefit-icon">🌬️</span>
                                <div className="benefit-title">Oxygen Producer</div>
                                <div className="benefit-description">Healthy grass produces enough oxygen to sustain a family of four for an entire year.</div>
                            </div>
                            <div className="benefit-item">
                                <span className="benefit-icon">❄️</span>
                                <div className="benefit-title">Cooling Effect</div>
                                <div className="benefit-description">Eight average front lawns provide the same cooling effect as 70 tons of air conditioning.</div>
                            </div>
                            <div className="benefit-item">
                                <span className="benefit-icon">🌪️</span>
                                <div className="benefit-title">Dust Reduction</div>
                                <div className="benefit-description">Grass captures an estimated 12 million tons of dust and dirt from the atmosphere each year.</div>
                            </div>
                            <div className="benefit-item">
                                <span className="benefit-icon">🌍</span>
                                <div className="benefit-title">Carbon Storage</div>
                                <div className="benefit-description">U.S. lawns could store up to 37 billion pounds of carbon annually when grass clippings decompose naturally.</div>
                            </div>
                        </div>

                        <div className="content-grid">
                            <div className="card">
                                <h3 className="card-title">Why Core Aeration Matters</h3>
                                <div className="card-content">
                                    <strong>Relieves Soil Compaction:</strong> Compacted soil prevents water, oxygen, and nutrients from reaching the roots. Core aeration opens up the soil, giving your grass room to breathe and grow.<br /><br />

                                    <strong>Improves Water and Nutrient Absorption:</strong> The holes provide entry points for nutrients, air, and water while creating an ideal bed for overseeding. This allows deeper penetration and improves efficiency.<br /><br />

                                    <strong>Reduces Thatch Build-Up:</strong> Breaks down the layer of dead organic matter that blocks essential resources and encourages beneficial microbial activity.
                                </div>
                            </div>

                            <div className="card">
                                <h3 className="card-title">How Core Aeration Works</h3>
                                <div className="card-content">
                                    <strong>Equipment Used:</strong> A core aerator uses hollow tines to remove 2–4 inch plugs of soil from the lawn.<br /><br />

                                    <strong>After Aeration:</strong> The soil plugs are left on the lawn to naturally break down and return nutrients to the soil.<br /><br />

                                    <strong>Additional Benefits:</strong> Prevents water pooling, reduces runoff, and boosts drought resistance through deeper root development.
                                </div>
                            </div>
                        </div>

                        <div className="process-section">
                            <h2 className="section-title">Aeration Frequency Guide</h2>
                            <div className="timing-grid">
                                <div className="timing-item">
                                    <div className="timing-label">Clay Soil / High Traffic</div>
                                    2 times per year
                                </div>
                                <div className="timing-item">
                                    <div className="timing-label">Loamy / Moderate Traffic</div>
                                    2 times per year
                                </div>
                                <div className="timing-item">
                                    <div className="timing-label">Sandy / Low Traffic</div>
                                    1 time per year
                                </div>
                            </div>
                        </div>

                        <div className="highlight-box">
                            <div className="highlight-title">Best Timing for Aeration</div>
                            <strong>Cool-season grasses:</strong> Early spring or fall<br />
                            <strong>Warm-season grasses:</strong> Late spring or early fall<br /><br />
                            <strong>Pro Tip:</strong> Aerate when soil is moist—but not wet—for optimal results.
                        </div>

                        <div className="mistakes-section">
                            <h2 className="section-title" >Common Aeration Mistakes to Avoid</h2>

                            <div className="mistake-item">
                                <div className="mistake-title">Poor Timing</div>
                                <div className="card-content">
                                    • Avoid aerating during drought or extreme heat<br />
                                    • Don't aerate when soil is bone-dry or waterlogged<br />
                                    • Never aerate dormant grass<br />
                                    • Follow seasonal guidelines for your grass type
                                </div>
                            </div>

                            <div className="mistake-item">
                                <div className="mistake-title">Equipment Mistakes</div>
                                <div className="card-content">
                                    • Use core aerators, not spike aerators (which compact soil)<br />
                                    • Mark all underground obstacles before starting<br />
                                    • Light watering the day before improves penetration<br />
                                    • Take your time—rushing damages turf and equipment
                                </div>
                            </div>

                            <div className="mistake-item">
                                <div className="mistake-title">Neglecting Aftercare</div>
                                <div className="card-content">
                                    • Avoid heavy foot traffic for several days<br />
                                    • Leave soil plugs to decompose naturally<br />
                                    • Wait before mowing and keep height higher initially<br />
                                    • Consider topdressing to improve long-term soil quality
                                </div>
                            </div>
                        </div>

                        <div className="cta-section">
                            <h2 className="cta-title">Is Core Aeration Worth It?</h2>
                            <p className="cta-text">
                                Absolutely. Without proper aeration, compacted soil and thatch buildup can choke your lawn, leaving it thin, stressed, and discolored. Core aeration restores healthy airflow, encourages strong root development, and sets the foundation for a thick, lush lawn that will be the envy of your neighborhood.
                            </p>
                        </div>
                    </div>
                

            </section> */}
            <div className="containerId mx-auto px-4">
            <div className="section">
                <h1 className="hero-title">Core Aeration: The Secret to a Healthier Lawn</h1>
                <p className="intro-text">
                    Core aeration is one of the most effective ways to revitalize your lawn. It involves removing small plugs of soil to improve the flow of air, water, and nutrients to the grass roots. Over time, lawns become compacted and develop a thick layer of thatch, both of which limit root growth and weaken the turf. Core aeration solves these problems—naturally.
                </p>

                <h2 className="section-title">Benefits of a Healthier Lawn</h2>
                <div className="benefits-grid">
                    <div className="benefit-card">
                        <div className="benefit-title">
                            <span className="benefit-icon">🌊</span>
                            Soil Filtration
                        </div>
                        <div className="benefit-description">
                            Lawns improve soil filtration, helping to purify rainwater as it seeps into the ground.
                        </div>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-title">
                            <span className="benefit-icon">💨</span>
                            Oxygen Producer
                        </div>
                        <div className="benefit-description">
                            Healthy grass produces enough oxygen to sustain a family of four for an entire year. (Dr. Thomas L. Watschke, Pennsylvania State University)
                        </div>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-title">
                            <span className="benefit-icon">❄️</span>
                            Cooling Effect
                        </div>
                        <div className="benefit-description">
                            The combined front lawns of just eight average homes can have the same cooling effect as 70 tons of air conditioning. (Maryland Turfgrass Study 1996)
                        </div>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-title">
                            <span className="benefit-icon">🌪️</span>
                            Dust Reduction
                        </div>
                        <div className="benefit-description">
                            Grass captures an estimated 12 million tons of dust and dirt from the atmosphere each year. (Dr. Thomas L. Watschke, Pennsylvania State University)
                        </div>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-title">
                            <span className="benefit-icon">🌍</span>
                            Carbon Storage
                        </div>
                        <div className="benefit-description">
                            Lawns act as a carbon sink—if grass clippings are left to decompose naturally, U.S. lawns could store up to 37 billion pounds of carbon annually. (Christina Milesi, NASA Ames Research Center 2006)
                        </div>
                    </div>
                </div>

                <div className="process-grid">
                    <div className="process-card">
                        <h3 className="process-title">🎯 Why Core Aeration Matters</h3>
                        <ul className="process-list">
                            <li><strong>Relieves Soil Compaction:</strong> Compacted soil prevents water, oxygen, and nutrients from reaching the roots. Core aeration opens up the soil, giving your grass room to breathe and grow.</li>
                            <li><strong>Improves Water and Nutrient Absorption:</strong> The holes left by core aeration provide a seed bed and an entry point for nutrients, air, and water, as well as providing a bed for overseeding.</li>
                            <li><strong>Reduces Thatch Build-Up:</strong> Thatch is a layer of dead organic matter that blocks essential resources. Core aeration helps break it down and encourages microbial activity.</li>
                            <li><strong>Prevents Water Pooling and Runoff:</strong> Aerated lawns absorb water more effectively, reducing puddling and erosion.</li>
                            <li><strong>Boosts Drought Resistance:</strong> Deeper and thicker roots make your lawn more resilient during dry, hot conditions.</li>
                        </ul>
                    </div>

                    <div className="process-card">
                        <h3 className="process-title">⚙️ How Core Aeration Works</h3>
                        <ul className="process-list">
                            <li><strong>Equipment Used:</strong> A core aerator uses hollow tines to remove 2–4 inch plugs of soil from the lawn.</li>
                            <li><strong>After Core Aeration:</strong> The soil plugs are left on the lawn to naturally break down and return nutrients to the soil.</li>
                            <li><strong>How Often to Core Aerate:</strong>
                                <ul className="nested-list">
                                    <li>Clay soil or high-traffic lawns: 2 times per year</li>
                                    <li>Loamy or moderate-traffic lawns: 2 times per year</li>
                                    <li>Sandy or low-traffic lawns: 1 time per year</li>
                                </ul>
                            </li>
                            <li>Core aeration is proven especially effective if it is done in conjunction with overseeding and fertilizing as part of a complete lawn care program.</li>
                        </ul>
                    </div>
                </div>

                <div className="timing-section">
                    <h3 className="section-title">📅 Best Time to Aerate</h3>
                    <div className="timing-grid">
                        <div className="timing-card">
                            <div className="timing-label">Cool-season grasses</div>
                            <div className="timing-value">Early spring or fall</div>
                        </div>
                        <div className="timing-card">
                            <div className="timing-label">Warm-season grasses</div>
                            <div className="timing-value">Late spring or early fall</div>
                        </div>
                    </div>
                    <div className="highlight-box">
                        <div className="highlight-title">Pro Tip</div>
                        Core aerate when the soil is moist—but not wet—for best results.
                    </div>
                </div>

                <div className="cta-section">
                    <h2 className="cta-title">Is Core Aeration Really Worth It?</h2>
                    <p className="cta-text">
                        Absolutely. Without it, compacted soil and thatch buildup can choke your lawn, leaving it thin, stressed, and discolored—especially late in the season. Core aeration restores healthy airflow, encourages strong and thicker root development, and sets the foundation for a thick, lush lawn.
                    </p>
                </div>
            </div>

            <div className="section caution-section">
                <h2 className="section-title" >Core Aeration Caution</h2>
                <p className="intro-text">
                    Core aeration is a great way to rejuvenate your lawn—but only if done correctly. Mistakes in timing or technique can damage your turf instead of helping it. Here's what to avoid:
                </p>

                <div className="mistake-card">
                    <h3 className="mistake-title">Mistake #1: Poor Timing</h3>
                    <ul className="process-list">
                        <li><strong>Too dry or too wet?</strong> Soil that's bone-dry won't allow deep core aeration, and soggy soil can clog the machine or tear the turf.</li>
                        <li><strong>During drought or extreme heat?</strong> Avoid aerating when your lawn is already under stress—it could worsen the damage.</li>
                        <li><strong>Wrong season?</strong>
                            <ul className="nested-list">
                                <li>Cool-season grasses: Core aerate in early fall or spring</li>
                                <li>Warm-season grasses: Core aerate in late spring or early summer</li>
                            </ul>
                            Never core aerate when your grass is dormant.
                        </li>
                    </ul>
                </div>

                <div className="mistake-card">
                    <h3 className="mistake-title">Mistake #2: Improper Equipment or Setup</h3>
                    <ul className="process-list">
                        <li><strong>Using a spike aerator:</strong> These can compact soil rather than loosen it. Always use a core aerator that removes actual plugs of soil.</li>
                        <li><strong>Skipping pre-watering:</strong> Light watering the day before helps the tines penetrate better—but don't soak the lawn.</li>
                        <li><strong>Forgetting to mark obstacles:</strong> Flag sprinkler heads, valve boxes, and anything underground to avoid damage.
                            <ul className="nested-list">
                                <li><strong>Tip:</strong> We recommend calling in a public utility locator company before starting any job. Private utilities are different than public utilities.</li>
                            </ul>
                        </li>
                        <li><strong>Rushing the job:</strong> Going too fast can damage both the turf and your aerator. Take your time.</li>
                    </ul>
                </div>

                <div className="mistake-card">
                    <h3 className="mistake-title">Mistake #3: Neglecting Aftercare</h3>
                    <ul className="process-list">
                        <li><strong>Heavy foot traffic too soon:</strong> Stay off the lawn for a few days to allow the soil to settle and recover.</li>
                        <li><strong>Removing the soil plugs:</strong> Let them decompose naturally—they feed your lawn with nutrients.</li>
                        <li><strong>Mowing too soon or too short:</strong> Give grass seed time to establish and keep your mower height higher during the first mow.</li>
                        <li><strong>Skipping topdressing:</strong> Applying a light layer of soil post core aeration helps smooth the lawn and improve long-term soil quality.</li>
                    </ul>
                </div>
            </div>

            <div className="section safety-section">
                <h2 className="section-title" >Core Aeration: Safety Tips & Best Practices</h2>
                <p className="intro-text" >
                    Core aeration improves lawn health—but it's essential to do it safely and correctly. Here are 8 key precautions to protect your lawn, equipment, and yourself:
                </p>

                <div className="safety-grid">
                    <div className="safety-tip">
                        <div className="safety-number">1</div>
                        <h3 className="safety-tip-title">Mark Underground Hazards</h3>
                        <p className="safety-tip-description">
                            Before you begin, clearly mark all sprinkler heads, utility lines, invisible fence, and valve boxes. This helps prevent accidental damage and costly repairs.
                        </p>
                    </div>

                    <div className="safety-tip">
                        <div className="safety-number">2</div>
                        <h3 className="safety-tip-title">Check Soil Moisture</h3>
                        <p className="safety-tip-description">
                            Core aerate when the soil is moist, not dry or soggy. Dry soil is too hard for the tines to penetrate, while super wet soil can clog the machine.
                        </p>
                    </div>

                    <div className="safety-tip">
                        <div className="safety-number">3</div>
                        <h3 className="safety-tip-title">Avoid Heat or Drought Conditions</h3>
                        <p className="safety-tip-description">
                            Extreme heat or dry conditions can stress your grass. Aim to core aerate during mild weather and when your lawn is actively growing.
                        </p>
                    </div>

                    <div className="safety-tip">
                        <div className="safety-number">4</div>
                        <h3 className="safety-tip-title">Wear Eye Protection</h3>
                        <p className="safety-tip-description">
                            Always wear safety glasses or goggles while operating the core aerator to shield your eyes from flying debris.
                        </p>
                    </div>

                    <div className="safety-tip">
                        <div className="safety-number">5</div>
                        <h3 className="safety-tip-title">Watch for Obstacles</h3>
                        <p className="safety-tip-description">
                            Never run the core aerator over sidewalks, driveways, or visible obstacles. Raise the tines when crossing hard surfaces and avoid rocks, tree roots, or sprinkler heads.
                        </p>
                    </div>

                    <div className="safety-tip">
                        <div className="safety-number">6</div>
                        <h3 className="safety-tip-title">Handle Equipment Carefully</h3>
                        <p className="safety-tip-description">
                            Core aerators are heavy machines with moving parts. Use proper technique, follow all safety instructions, and avoid loose clothing.
                        </p>
                    </div>

                    <div className="safety-tip">
                        <div className="safety-number">7</div>
                        <h3 className="safety-tip-title">Set Correct Depth and Spacing</h3>
                        <p className="safety-tip-description">
                            Aim for plugs 2–4 inches deep and 3–6 inches apart. This provides effective aeration without damaging the lawn.
                        </p>
                    </div>

                    <div className="safety-tip">
                        <div className="safety-number">8</div>
                        <h3 className="safety-tip-title">Make Overlapping Passes</h3>
                        <p className="safety-tip-description">
                            For compacted areas, make a second pass at a 90-degree angle to the first to ensure even coverage.
                        </p>
                    </div>
                </div>
            </div>
            </div>
            <section className="py-16 bg-white mt-4">
                <div className="container mx-auto px-4">
                    <div id="faq" className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-[#2C3E50] mb-12 text-center">
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-4">
                            {faqData.map((item, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <button
                                        className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
                                        onClick={() => toggleQuestion(index)}
                                    >
                                        <span className="text-lg font-semibold text-[#2C3E50]">{item.question}</span>
                                        <span className={`transform transition-transform duration-200 ${activeQuestion === index ? 'rotate-180' : ''}`}>
                                            ▼
                                        </span>
                                    </button>

                                    <div
                                        className={`px-6 py-4 bg-white transition-all duration-300 ease-in-out ${activeQuestion === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                                            }`}
                                    >
                                        <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: (item.answer).split('\n').map(line => `<p>${line}</p>`).join('') }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default FAQ;
