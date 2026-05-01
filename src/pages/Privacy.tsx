import { Card, CardContent, CardHeader } from '../components/ui/card'
import PublicLayout from '../components/layout/PublicLayout'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'

const Privacy = () => {
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0);
      }, [pathname]);
    return (
        <PublicLayout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <Card className="shadow-lg border-0 overflow-hidden bg-white rounded-lg">
                        <CardHeader className="bg-gradient-to-r from-lime-600 to-lime-700 text-white p-6 sm:p-8">
                            <div className="text-center">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                                    MEEKOS PRIVACY POLICY
                                </h1>
                                <p className="text-lime-100 text-sm sm:text-base">
                                    Effective Date: June 17, 2025
                                </p>
                            </div>
                        </CardHeader>
                        
                        <CardContent className="p-6 sm:p-8 lg:p-10">
                            <div className="prose prose-gray max-w-none">
                                {/* Introduction */}
                                <div className="mb-8 p-4 sm:p-6 bg-lime-50 rounded-lg border-l-4 border-lime-500">
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                                        This Privacy Notice explains how Meekos Link LLC., its affiliates, and its subsidiaries use your information and applies to all who use our websites and platforms. By using the Service, you acknowledge you have read the terms of this Privacy Notice.
                                    </p>
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                        If you have any questions, contact us at <a href="mailto:meekoslink@gmail.com" className="text-lime-600 hover:text-lime-800 underline">meekoslink@gmail.com</a>.
                                    </p>
                                </div>

                                {/* Section 1: Types of Information We Collect */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        1. Types of Information We Collect
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                                        We may collect the following categories of personal information from and about you:
                                    </p>
                                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                                        <ul className="space-y-3 text-sm sm:text-base text-gray-700">
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span><strong>Identifiers:</strong> such as your name, postal addresses, email addresses, social networking website user account names, telephone numbers, or other addresses at which you are able to receive communications.</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span><strong>Demographic information:</strong> such as your age, birthdate, and gender.</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span><strong>Commercial information:</strong> such as information that enables us to determine purchasing tendencies and order history; information collected through your interactions with social networks; and information about friends who refer you or whom you have referred.</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span><strong>Location information:</strong> such as information related to your state/province, city, or zip code, and, if you agree, more specific location information that is provided through the GPS functionality on mobile devices used to access the Service.</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span><strong>Financial information:</strong> such as information collected from you as needed to process payments for Meekos packages or other products or services that you buy, or as provided by you to administer your participation in optional services and programs, such as your payment card number, expiration date, and card verification number.</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span><strong>Internet and network activity information:</strong> such as information about your browsing behavior, search history, and interactions with websites and advertisements, including data from cookies, pixel tags, and web beacons.</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span><strong>Inferences regarding preferences and other characteristics:</strong> such as our assessment of the types of products or services you may have an interest in.</span>
                                            </li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Section 2: How Meekos Collects Information */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        2. How Meekos Collects Information
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                                        We may collect personal information about you from a variety of sources, including:
                                    </p>
                                    <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p><strong>From you:</strong> We collect information that you submit to us. For example, when you use the Service; make a purchase; register to receive information, products, or services available through the Service; or interact with us in other ways.</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p><strong>From your device:</strong> When you use the Service, we may collect information about the devices you use to access the Service, including hardware model, operating system and version, Internet Protocol ("IP") address, and other unique device identifiers, mobile network information, and information about the device's interaction with our Service.</p>
                                        </div>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                            <p><strong>Location information:</strong> We may collect different types of information about your location, including general information, such as the city, state, and/or zip code associated with your IP Address, and, if you agree, more specific location information that is provided through the GPS functionality on mobile devices used to access the Service.</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <p><strong>Social media networks and other third parties:</strong> We may obtain information about you or your use of the Service from third party sources, such as our vendors, like web hosting providers, analytics providers, or advertisers.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 3: How Meekos Uses Information */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        3. How Meekos Uses Information
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                                        We may use information collected as described in this Privacy Notice to:
                                    </p>
                                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                                        <ul className="space-y-2 text-sm sm:text-base text-gray-700">
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>Operate, maintain, and improve the Service and other programs, features, and functionality related to the Service;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>Provide you with interest-based ads, push notifications, communications, and offers for products and services from us and our business partners;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>Facilitate and fulfill orders;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>Process your payments;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>Answer your questions and respond to your requests;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>Perform analytics and conduct customer research;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>Communicate and provide additional information that may be of interest to you about Meekos and our business partners;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>Send you reminders, technical notices, updates, security alerts, support and administrative messages;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>Manage our everyday business needs, such as administration of the Service, forum management, fulfillment, analytics, fraud prevention, and enforcement of our corporate reporting obligations and Terms of Use;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>Verify your requests made pursuant to this Privacy Notice;</span>
                                            </li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Section 4: When and Why Meekos Discloses Information */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        4. When and Why Meekos Discloses Information
                                    </h2>
                                    <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                                        <p>We may share your personal information as follows:</p>
                                        <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                                            <p><strong>Legal compliance:</strong> as required to comply with the law or legal obligations, such as to comply with legal orders and government requests, or as needed to support auditing, compliance, and corporate governance functions;</p>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                                            <p><strong>Service providers:</strong> with our vendors who perform a variety of services and functions for us, such as data storage, order fulfillment, transmitting emails, and managing digital content;</p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                            <p><strong>Business transfers:</strong> in the event we go through a business transition such as a merger, acquisition by another company, bankruptcy, reorganization, or sale of all or a portion of our assets;</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                                            <p><strong>Protection:</strong> to combat fraud or criminal activity, and to protect our rights, users, and business partners;</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
                                            <p><strong>With consent:</strong> otherwise with your consent.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 5: Security of Personal Information */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        5. Security of Personal Information
                                    </h2>
                                    <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                        <p className="mb-4">
                                            Meekos has implemented an information security program that contains administrative, technical, and physical controls that are designed to reasonably safeguard personal information. For example, we use industry-standard encryption technology to secure financial account information.
                                        </p>
                                        <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                                            <p><strong>Note:</strong> No method of transmission over the Internet, or method of electronic storage, is 100% secure. If you have any questions about security on our website, you can contact us at <a href="mailto:meekoslink@gmail.com" className="text-lime-600 hover:text-lime-800 underline">meekoslink@gmail.com</a>.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 6: Retention of Personal Data */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        6. Retention of Personal Data
                                    </h2>
                                    <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                        <p>
                                            We will retain your personal data for as long as your account is active or as needed to provide you services. If you close your account, we will retain your personal data for a period where it is necessary to continue operating our business effectively, to maintain a record of your transactions for financial reporting purposes or fraud prevention purposes until these purposes no longer exist, and to retain as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.
                                        </p>
                                    </div>
                                </section>

                                {/* Section 7: Your Rights Regarding Personal Information */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        7. Your Rights Regarding Personal Information
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                                        You have certain rights with regard to your personal information:
                                    </p>
                                    <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
                                        <ul className="space-y-3 text-sm sm:text-base text-gray-700">
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You have the right to know and request information about the categories and specific pieces of personal information we have collected about you within the last 12 months;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You have the right to update your personal information;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You have the right to request a portable copy of your personal information;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You have the right to request that Meekos delete your personal information, subject to certain exceptions allowed under applicable law;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You have the right to opt-out of certain disclosures of your personal information for valuable consideration;</span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="text-lime-600 mr-2 mt-1">•</span>
                                                <span>You have the right to not be discriminated against for exercising any of the above-listed rights.</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="mt-4 p-4 bg-lime-50 rounded-lg border-l-4 border-lime-500">
                                        <p className="text-sm sm:text-base text-gray-700">
                                            You may exercise these rights by sending an email to <a href="mailto:meekoslink@gmail.com" className="text-lime-600 hover:text-lime-800 underline">meekoslink@gmail.com</a>
                                        </p>
                                    </div>
                                </section>

                                {/* Section 8: Your Choices */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        8. Your Choices
                                    </h2>
                                    <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                                        <p>You can limit the information you provide to Meekos, and you can limit the communications that Meekos sends to you. In particular:</p>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p><strong>Commercial Emails:</strong> You may choose not to receive commercial e-mails from us by following the instructions contained in any of the commercial e-mails we send or by logging into your account and adjusting your email preferences.</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <p><strong>Cookies and Other Technologies:</strong> You may manage how your browser handles cookies by adjusting its privacy and security settings.</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <p><strong>Device Data:</strong> You may manage how your mobile device and mobile browser share certain device data with Meekos by adjusting the privacy and security settings on your mobile device.</p>
                                        </div>
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                            <p><strong>Emails from Business Partners:</strong> If you wish to opt-out of receiving offers directly from our business partners, you can follow the opt-out instructions in the emails they send you.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section 9: Children's Privacy */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        9. Children's Privacy
                                    </h2>
                                    <div className="bg-red-50 p-4 sm:p-6 rounded-lg border-l-4 border-red-500">
                                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            The Service is a general audience site not directed at children under the age of 16 and Meekos has no actual knowledge of the sale of information of minors under 16 years of age. By using Meekos, you represent that you are at least eighteen years old and understand that you must be at least eighteen years old in order to create an account and purchase the goods or services advertised through the Service.
                                        </p>
                                    </div>
                                </section>

                                {/* Section 10: California Privacy Rights */}
                                <section className="mb-8">
                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-lime-200">
                                        10. California Privacy Rights and Other Countries
                                    </h2>
                                    <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
                                        <p>If you reside in Canada, you may have the right to be provided with access to personal information that we have collected about you and written information about our policies and practices with respect to the transfer of your personal information to vendors outside Canada.</p>
                                        <p>Pursuant to Section 1798.83 of the California Civil Code, residents of California have the right to request, once a year, if we have shared their personal information with other companies for those companies' direct marketing purposes during the preceding calendar year.</p>
                                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                            <p>To request information, contact us at <a href="mailto:meekoslink@gmail.com" className="text-lime-600 hover:text-lime-800 underline">meekoslink@gmail.com</a> and include "Shine the Light Request" in your correspondence.</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Contact Information */}
                                <div className="mt-12 p-4 sm:p-6 bg-lime-50 rounded-lg border-l-4 border-lime-500">
                                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                                        Contact Us
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-700">
                                        Please contact us if you have any questions or comments about our privacy practices or this Privacy Notice. You can reach us at{' '}
                                        <a href="mailto:meekoslink@gmail.com" className="text-lime-600 hover:text-lime-800 underline">
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

export default Privacy;