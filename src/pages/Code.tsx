import PublicLayout from '../components/layout/PublicLayout';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const Code = () => {
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-white shadow-md rounded-lg">

                {/* Header */}
                <div className="bg-gradient-to-r from-lime-600 to-lime-700 text-white p-6 sm:p-8 mt-8 rounded-t-lg">
                    <div className="text-center">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                            MEEKOS VENDOR CODE OF CONDUCT
                        </h1>
                        <p className="text-green-100 text-sm sm:text-base">
                            Effective Date: June 17, 2025
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 lg:p-10">
                    {/* Introduction */}
                    <div className="mb-8 p-4 sm:p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                            Meekos Link LLC ("Meekos", "we", "us", or "our") owns and operates the website, coreaeration.com, and this Vendor Code of Conduct (the "Code") sets out guidelines and requirements for all merchants, vendors, and suppliers (collectively, "Vendors") that do business with any Meekos Link LLC business or subsidiary (collectively, "Meekos" or "we").
                        </p>
                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                            We expect our Vendors (including their employees, agents, subcontractors, and affiliates) to comply with the Code in conducting business with or on behalf of Meekos, even when the Code exceeds the requirements of applicable law.
                        </p>
                        <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                            <p className="font-semibold text-red-800 text-sm sm:text-base">
                                Violations of the Code can result in severe consequences for Meekos and/or its Vendors. Accordingly, Meekos will take appropriate action to ensure compliance with the Code, up to and including termination of business with the Vendor.
                            </p>
                        </div>
                    </div>

                    {/* Anti-Bribery & Corruption */}
                    <section className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-200">
                            ANTI-BRIBERY & CORRUPTION
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                                    Books, Records, and Business Integrity
                                </h3>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    Meekos prohibits corruption, extortion, and embezzlement in any form. For this reason, Vendors must ensure that their accounting and financial records related to their business with Meekos comply with applicable laws and meet applicable standards of accuracy and completeness. Meekos also expects Vendors to provide honest and accurate invoices to any consumer that uses Meekos platforms.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                                    Bribery, Kickbacks, and Improper Payments
                                </h3>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    Vendors must ensure that their employees, agents, subcontractors, and affiliates comply with all applicable bribery and anti-corruption laws, including but not limited to the U.S. Foreign Corrupt Practices Act ("FCPA") and the UK Bribery Act. To that end, Vendors must not promise, offer, or accept bribes, kickbacks, or other improper or unlawful payments or engage third parties to facilitate such conduct when conducting business with or on behalf of Meekos.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                                    Business Courtesies
                                </h3>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                                    Vendors must avoid offering gifts, meals, entertainment, or travel (collectively "Business Courtesies") that might improperly influence, or appear to influence, Meekos employees or agents, or that might embarrass Meekos or the Vendor.
                                </p>

                                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg mb-4">
                                    <h4 className="font-semibold text-gray-800 mb-3">Gifts</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <span className="text-green-600 font-semibold mr-2 mt-1">✓</span>
                                            <div>
                                                <span className="font-medium text-gray-800">Acceptable:</span>
                                                <span className="text-gray-700"> Gifts that are given infrequently and that are not of substantial value, such as food items or promotional materials bearing the Vendor's logo (e.g., shirts, hats, pens, etc.).</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-red-600 font-semibold mr-2 mt-1">✗</span>
                                            <div>
                                                <span className="font-medium text-gray-800">Unacceptable:</span>
                                                <span className="text-gray-700"> Cash or cash equivalents (e.g., bitcoin, debit cards, gift cards, gift certificates, prepaid cards, etc.) regardless of value, or any items with a value exceeding USD $250.00 unless they are pre-approved by Meekos via <a href="mailto:meekoslink@gmail.com" className="text-green-600 hover:text-green-800 underline">meekoslink@gmail.com</a>.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-3">Meals, Entertainment and Travel</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-start">
                                            <span className="text-green-600 font-semibold mr-2 mt-1">✓</span>
                                            <div>
                                                <span className="font-medium text-gray-800">Acceptable:</span>
                                                <span className="text-gray-700"> Reasonable meals, travel, lodging, and entertainment expenses related to a legitimate business purpose.</span>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <span className="text-red-600 font-semibold mr-2 mt-1">✗</span>
                                            <div>
                                                <span className="font-medium text-gray-800">Unacceptable:</span>
                                                <span className="text-gray-700"> Any meals, travel, lodging, or entertainment expenses exceeding USD $250.00 per person unless pre-approved by Meekos via <a href="mailto:meekoslink@gmail.com" className="text-green-600 hover:text-green-800 underline">meekoslink@gmail.com</a>.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                                    Facilitating Payments
                                </h3>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    Vendors must not offer or make facilitating payments (also known as "expediting" or "grease" payments) to speed up or secure the performance of a routine government action (e.g., customs clearance) on behalf of Meekos. Meekos Anti-Corruption Policy prohibits facilitating payments and many countries treat them as illegal bribes.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                                    Tax Evasion
                                </h3>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    Vendors located and/or conducting business in the UK, or otherwise subject to the UK Criminal Finances Act 2017, must implement and maintain "reasonable prevention procedures," as required by the Act, to counter the risk of tax evasion, or facilitation of tax evasion, by any persons or entities associated with the Vendor.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Anti-Counterfeiting & Intellectual Property */}
                    <section className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-200">
                            ANTI-COUNTERFEITING & INTELLECTUAL PROPERTY PROTECTION
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                                    Anti-Counterfeiting
                                </h3>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    Meekos strives to ensure that all of its products are of the highest quality and reliability and expects Vendors to notify us immediately if they believe or have a reason to believe that they have provided Meekos or Meekos customers with counterfeit, illegally diverted, or stolen products, parts, or materials. The sale of counterfeit products on Meekos platform is strictly prohibited.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                                    Intellectual Property Protection
                                </h3>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    Vendors must respect intellectual property rights, including Meekos intellectual property rights and the intellectual property rights of others, at all times. Respecting the intellectual property rights of Meekos and others includes, but is not limited to, obtaining proper authorization and licensing agreements before using any intellectual property, refusing to misuse others' intellectual property, including patents, trademarks, copyrights, and trade secrets, and complying with all applicable laws as they relate to Vendor products and listings.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Confidentiality & Data Privacy */}
                    <section className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-200">
                            CONFIDENTIALITY & DATA PRIVACY
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                                    Confidentiality and Protection of Information
                                </h3>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    Meekos is committed to protecting its own confidential information and the confidential information of its business partners, Vendors, customers, employees, and candidates for employment. Meekos requires Vendors to comply with all applicable laws and regulations governing confidential and proprietary information and to take all necessary measures to safeguard all such information.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                                    Data Protection and Privacy
                                </h3>
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                    Meekos respects everyone's right to the protection of their personal data, as this term is defined in the countries in which Meekos operates, and everyone's right to integrity in connection with the processing of personal data. Meekos requires Vendors to comply with all applicable privacy and information security laws and associated regulatory requirements, such as the General Data Protection Regulation ("GDPR").
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Labor & Human Rights */}
                    <section className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-200">
                            LABOR & HUMAN RIGHTS
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Child Labor
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Meekos strictly prohibits the use of child labor. Vendors must never employ a person younger than age 15 or otherwise interfere with a child's education.
                                </p>
                            </div>

                            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Coerced Labor
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Vendors must never engage in any form of coerced labor, such as slave labor, prison labor, indentured labor, bonded labor, and any other form of involuntary servitude.
                                </p>
                            </div>

                            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Equal Opportunity
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    We expect our Vendors to adopt and implement similar policies or practices and refrain from discrimination in conducting business with or on behalf of Meekos.
                                </p>
                            </div>

                            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Health and Safety
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Vendors must provide a safe and healthy work environment to prevent accidents or injuries arising out of conducting business for Meekos.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Fair Business & Competition */}
                    <section className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-200">
                            FAIR BUSINESS, ADVERTISING, CONSUMER PROTECTION & COMPETITION LAWS
                        </h2>

                        <div className="bg-yellow-50 p-4 sm:p-6 rounded-lg border-l-4 border-yellow-500">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Key Requirements
                            </h3>
                            <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 mt-1">•</span>
                                    <span>Understand and comply with all applicable fair business, advertising, consumer protection and competition laws</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 mt-1">•</span>
                                    <span>Must not exploit emergency situations by charging excessively high prices</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 mt-1">•</span>
                                    <span>Treat Meekos customers honestly, fairly, and appropriately</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 mt-1">•</span>
                                    <span>Ensure deal and offer descriptions are accurate and truthful</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-600 mr-2 mt-1">•</span>
                                    <span>Provide products and services that are genuine and of reasonable quality</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* International Trade */}
                    <section className="mb-8">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-green-200">
                            INTERNATIONAL TRADE
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Export Controls
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Vendors must inform Meekos of any relevant restrictions on the export of their products, services, software, technology, or technical data outside the United States.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                    Economic Sanctions
                                </h3>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    Vendors must comply with all economic sanctions programs administered by OFAC, the U.S. Department of State, the United Nations, and the European Union.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Reporting Violations */}
                    <div className="mt-12 p-4 sm:p-6 bg-red-50 rounded-lg border-l-4 border-red-500">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">
                            REPORTING VIOLATIONS
                        </h3>
                        <p className="text-sm sm:text-base text-gray-700 mb-4">
                            Anyone that has knowledge of a potential or actual violation of the Code should report the violation to:
                        </p>
                        <div className="text-center">
                            <a
                                href="mailto:meekoslink@gmail.com"
                                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                            >
                                meekoslink@gmail.com
                            </a>
                        </div>
                    </div>

                    {/* Liability Disclaimer */}
                    <div className="mt-8 p-4 sm:p-6 bg-gray-100 rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            CIVIL AND/OR LIABILITIES
                        </h3>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Meekos is not responsible, to be found guilty, and/or liable for any actions of the vendors, that may be unlawfully or cause harm to public or private property or person.
                        </p>
                    </div>
                </div>

            </div>
        </PublicLayout>
    )
}

export default Code;