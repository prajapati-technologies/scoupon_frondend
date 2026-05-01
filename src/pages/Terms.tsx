import { Card, CardContent, CardHeader } from '../components/ui/card'
import PublicLayout from '../components/layout/PublicLayout'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Terms = () => {
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0);
      }, [pathname]);
    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <Card className="shadow-lg border-0 overflow-hidden bg-white">
                    <CardHeader className="bg-gradient-to-r from-[#a0b830] to-[#8fa029] text-white p-6 sm:p-8">
                            <div className="text-center">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                                    MEEKOS TERMS OF USE
                                </h1>
                                <p className="text-lime-100 text-sm sm:text-base">
                                    Effective Date: June 17, 2025
                                </p>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="p-6 sm:p-8 lg:p-10">
                            <div className="prose prose-gray max-w-none">
                                {/* Introduction */}
                                <div className="mb-8 p-4 sm:p-6 bg-[#a0b830]/10 rounded-lg border-l-4 border-[#a0b830]">
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                                        Welcome to the Core Aeration site (defined below). By using it, you are agreeing to these Terms of Use (defined below). Please read them carefully. If you have any questions, send an email to <a href="mailto:meekoslink@gmail.com" className="text-[#a0b830] hover:text-[#8fa029] underline">meekoslink@gmail.com</a>. These Terms of Use were last updated on June 17, 2025.
                                    </p>
                                </div>

                                {/* Acceptance of Terms */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        ACCEPTANCE OF TERMS OF USE
                                    </h2>
                                    <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                                        <p>
                                            Meekos Link LLC ("Meekos", "we", "us", or "our") owns and operates the website, coreaeration.com, the mobile and touch versions and any sites we have now or in the future that reference these Terms of Use sets out guidelines and requirements for all vendors, and suppliers (collectively, "Vendors") that do business with any Meekos Link LLC business or subsidiary (collectively, "Meekos" or "we").
                                        </p>
                                        <p>
                                            You also agree to our Privacy Statement, incorporated herein by reference and located within our Privacy Policy ("Privacy Statement"), and acknowledge that you will regularly visit the Terms of Use (defined below) to familiarize yourself with any updates. The Privacy Statement, together with these terms of use, and any other terms contained herein or incorporated herein by reference, are collectively referred to as the "Terms of Use." The term "using" also includes any person or entity that accesses or uses the Site with crawlers, robots, data mining, or extraction tools or any other functionality.
                                        </p>
                                        <div className="p-4 sm:p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                            <p className="font-semibold text-red-800 text-sm sm:text-base">
                                                IF YOU DO NOT AGREE TO THESE TERMS OF USE, IMMEDIATELY STOP USING THE SITE AND DO NOT USE ANY MEEKOS SERVICE, PARTICIPATE IN ANY PROGRAM OR PURCHASE ANY AD, PACKAGE, PRODUCT OR OTHER GOOD OR SERVICE OFFERED THROUGH THE SITE.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 1: About the Site */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        1. About the Site
                                    </h2>
                                    <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                                        <p>
                                            The Site is a platform through which certain vendors ("Vendors") (a) advertise for Core Aeration lawn services. Vendors are solely responsible to you for the care, quality, and delivery of the goods and services provided.
                                        </p>
                                        <p>
                                            In addition, the Site also provides a platform through which you can purchase products from Meekos ("Products") and participate in other available programs.
                                        </p>
                                        <p>
                                            Certain Vendor Offerings, Products, other available programs and pricing on the Site may change at any time in Meekos sole discretion, without notice.
                                        </p>
                                    </div>
                                </section>

                                {/* Section 2: Ownership */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        2. Ownership of the Site
                                    </h2>
                                    <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                        <p>
                                            The Site, any content on the Site, and the infrastructure used to provide the Site are proprietary to us, our affiliates, Vendors, and other content providers. By using the Site and accepting these Terms of Use: (a) Meekos grants you a limited, personal, non-transferable, nonexclusive, revocable license to use the Site pursuant to these Terms of Use and to any additional terms and policies set forth by Meekos; and (b) you agree not to reproduce, distribute, create derivative works from, publicly display, publicly perform, license, sell, or re-sell any content, software, products, or services obtained from or through the Site without the express permission of Meekos.
                                        </p>
                                    </div>
                                </section>

                                {/* Section 3: Use of the Site */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        3. Use of the Site
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                                        As a condition of your use of the Site, you agree that:
                                    </p>
                                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                                        <ul className="space-y-3 text-sm sm:text-base text-gray-700">
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You have reached the age of majority in the state or province in which you reside;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You are able to create a binding legal obligation;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You are not barred from receiving products or services under applicable law;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You will not attempt to use the Site with crawlers, robots, data mining, or extraction tools or any other functionality;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>Your use of the Site will at all times comply with these Terms of Use;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You will only make legitimate purchases that comply with the letter and spirit of the terms of the respective offers;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You have the right to provide any and all information you submit to the Site, and all such information is accurate, true, current, and complete;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You will update and correct information you have submitted to the Site, including all account information, and ensure that it is accurate at all times (out-of-date information will invalidate your account);</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You will only purchase a Package, or participate in other available programs through the Site by creating an account on the Site, and any purchase will be subject to the applicable Terms of Sale set forth in these Terms of Use.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Additional sections continue with similar styling... */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        4. Access to the Site
                                    </h2>
                                    <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                        <p>
                                            Meekos retains the right, at our sole discretion, to deny service or use of the Site or an account to anyone at any time and for any reason. While we use reasonable efforts to keep the Site and your account accessible, the Site and/or your account may be unavailable from time to time. You understand and agree that there may be interruptions in service or events, Site access, or access to your account due to circumstances both within our control (e.g., routine maintenance) and outside of our control.
                                        </p>
                                    </div>
                                </section>

                                {/* Continue with more sections... */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        5. Modification
                                    </h2>
                                    <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                        <p>
                                            We reserve the right at all times to discontinue or modify any part of these Terms of Use in our sole discretion. If we make changes that affect your use of the Site or our services we will post notice of the change on the Terms of Use page. Any changes to these Terms of Use will be effective upon our posting of the notice; provided that these changes will be prospective only and not retroactive.
                                        </p>
                                    </div>
                                </section>

                                {/* Contact Information */}
                                <div className="mt-12 p-4 sm:p-6 bg-[#a0b830]/10 rounded-lg border-l-4 border-[#a0b830]">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                                        Questions or Concerns?
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-700">
                                        If you have any questions about these Terms of Use, please contact us at{' '}
                                        <a href="mailto:meekoslink@gmail.com" className="text-[#a0b830] hover:text-[#8fa029] underline">
                                            meekoslink@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
        </PublicLayout>
    )
}

export default Terms