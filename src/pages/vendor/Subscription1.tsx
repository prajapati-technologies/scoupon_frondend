// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import { useAuth } from '../../useAuth';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { DashboardLayout } from './DashboardLayout';
// import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
// import { CheckCircle, AlertCircle, XCircle, MapPin } from 'lucide-react';
// import { Button } from '../../components/ui/button';
// import { PaymentModal } from './PaymentModal1';
// import { Alert, AlertDescription } from '../../components/ui/alert';
// import { User, Zipcode } from '../../ProtectedRouteProps';
// import ZipCodeManagement from './ZipCodeManagement';

// interface Package {
//   id: number;
//   name: string;
//   price: number;
//   duration: number;
//   status: string;
//   profiles: number;
//   description: string;
// }

// const Subscription = () => {
//   const { user } = useAuth();
//   const [user1, setUser1] = useState<User | null>(null);
//   const [packages, setPackages] = useState<Package[]>([]);
//   const [activePackageId, setActivePackageId] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [have, setHave] = useState(false);
//   const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [zipcodes, setZipcodes] = useState<Zipcode[]>([]);
//   const [showZipCodeManagement, setShowZipCodeManagement] = useState(false);
//   // Handle URL parameters for payment status messages
//   const searchParams = new URLSearchParams(location.search);
//   const success = searchParams.get('success') === 'true';
//   const canceled = searchParams.get('canceled') === 'true';
//   const error = searchParams.get('error');

//   // Clear URL parameters after displaying status
//   useEffect(() => {
//     if (success || canceled || error) {
//       if (success) {
//         toast.success('Payment successful! Your subscription is now active.');
//       } else if (canceled) {
//         toast.info('Payment was canceled.');
//       } else if (error) {
//         toast.error('There was an issue with your payment.');
//       }

//       const timer = setTimeout(() => {
//         navigate('/dashboard/subscription', { replace: true });
//       }, 100);

//       return () => clearTimeout(timer);
//     }
//   }, [success, canceled, error, navigate]);

//   useEffect(() => {
//     fetchPackages();
//     fetchActivePackage();
//   }, []);

//   const fetchPackages = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/packages`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       setPackages(response.data);
//     } catch (error) {
//       toast.error('Failed to fetch subscription packages');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchActivePackage = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/subscribepackage/my/pakcage`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`,
//         },
//       });
//       if(response.data.packageId){
//         setHave(true);
//       }
//       setActivePackageId(response.data?.packageId || null);
//     } catch (error) {
//       toast.error('Failed to fetch active package');
//     }
//   };
//   const handleZipcodesChange = (newZipcodes: Zipcode[]) => {
//     setZipcodes(newZipcodes);
//     // Update the user object with new zipcodes
//     if (user1) {
//       setUser1({
//         ...user1,
//         zipcodes: newZipcodes,
//         addedzipcodes: newZipcodes.length
//       });
//     }
//   };
//   const handleSubscribeClick = (pkg: Package) => {
//     // Don't allow subscribing if user already has an active package
//     // if (have) {
//     //   toast.warning("You already have an active subscription!");
//     //   return;
//     // }
//     setSelectedPackage(pkg);
//   };

//   return (
//     <DashboardLayout title="Subscriptions" user={user}>
//       <div className="max-w-7xl mx-auto py-6 space-y-8">
//         {/* Add current subscription status */}
//         {have && (
//           <Alert className="bg-blue-50 border-blue-200">
//             <CheckCircle className="h-4 w-4 text-blue-600" />
//             <AlertDescription className="text-blue-800">
//               You currently have an active subscription (Package ID: {activePackageId})
//             </AlertDescription>
//           </Alert>
//         )}

//         {/* Status Alerts */}
//         {success && (
//           <Alert className="bg-green-50 border-green-200">
//             <CheckCircle className="h-4 w-4 text-green-600" />
//             <AlertDescription className="text-green-800">
//               Your payment was successful! Your subscription is now active.
//             </AlertDescription>
//           </Alert>
//         )}

//         {canceled && (
//           <Alert className="bg-yellow-50 border-yellow-200">
//             <XCircle className="h-4 w-4 text-yellow-600" />
//             <AlertDescription className="text-yellow-800">
//               Your payment was canceled. No charges were made.
//             </AlertDescription>
//           </Alert>
//         )}

//         {error && (
//           <Alert className="bg-red-50 border-red-200">
//             <AlertCircle className="h-4 w-4 text-red-600" />
//             <AlertDescription className="text-red-800">
//               There was an error processing your payment. Please try again or contact support.
//             </AlertDescription>
//           </Alert>
//         )}

//         <section>
//           <h2 className="text-2xl font-bold mb-6">Available Packages</h2>
//           {loading ? (
//             <div className="text-center py-8">Loading packages...</div>
//           ) : (
//             <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//               {packages.map((pkg) => (
//                 <Card
//                   key={pkg.id}
//                   className={`relative overflow-hidden transition-all duration-300 bg-lime-100 hover:shadow-xl hover:scale-105 group border-2 
//                     ${pkg.id === activePackageId 
//                       ? 'border-green-500' 
//                       : 'border-transparent hover:border-[#a0b830]'}`}
//                 >
//                   {/* Add active package indicator */}
//                   {pkg.id === activePackageId && (
//                     <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
//                       Current Plan
//                     </div>
//                   )}

//                   <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-800 dark:to-green-900 border-b pb-4">
//                     <CardTitle className="flex justify-between items-center">
//                       <span className="text-xl font-bold text-gray-800 dark:text-white">{pkg.name}</span>
                    
//                     </CardTitle>
//                   </CardHeader>

//                   <CardContent className="space-y-6 p-6">
//                     {/* Price section with better visual hierarchy */}
//                     <div className="flex items-baseline justify-center">
//                       <span className="text-4xl font-extrabold text-[#a0b830]">${pkg.price}</span>
//                       <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 font-medium">
//                         /{pkg.duration} <span className="font-semibold">Year</span>{pkg.duration > 1 ? 's' : ''}
//                       </span>
//                     </div>

//                     {/* Profiles section with icon */}
//                     <div className="flex items-center justify-center bg-white dark:bg-gray-800 p-3 rounded-lg">
//                       <MapPin className="h-5 w-5 text-[#a0b830] mr-2" />
//                       <span className="text-2xl font-bold text-[#a0b830]">{pkg.profiles}</span>
//                       <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 font-medium">zipcodes</span>
//                     </div>

//                     {/* Features list with improved styling */}
//                     <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
//                       <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Package Features:</h4>
//                       <ul className="space-y-2">
//                         {pkg.description.split('\\n').map((line, index) => (
//                           <li key={index} className="flex items-start">
//                             <svg className="h-5 w-5 text-[#a0b830] mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                             </svg>
//                             <span className="text-sm text-gray-700 dark:text-gray-300">{line}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>

//                     {/* Update button section */}
//                     <div className="flex justify-center pt-4">
//                       <Button
//                         className="w-full bg-[#a0b830] hover:bg-[#8fa029]"
//                         onClick={() => handleSubscribeClick(pkg)}
//                       >
//                         Subscribe Now
//                       </Button>
//                     </div>
//                   </CardContent>

//                   {/* Subtle corner decoration */}
//                   <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#a0b830] opacity-10 rounded-tl-full" />
//                 </Card>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//       {showZipCodeManagement && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
//               <ZipCodeManagement
//                 zipcodes={zipcodes}
//                 totalZipcodes={user?.totalzipcodes || 0}
//                 onZipcodesChange={handleZipcodesChange}
//               />
//               <Button
//                 onClick={() => setShowZipCodeManagement(false)}
//                 className="mt-4 w-full"
//                 variant="outline"
//               >
//                 Close
//               </Button>
//             </div>
//           </div>
//         )}
//       {selectedPackage && (
//         <PaymentModal
//           isOpen={!!selectedPackage}
//           onClose={() => setSelectedPackage(null)}
//           packageId={selectedPackage.id}
//           packageName={selectedPackage.name}
//           amount={selectedPackage.price}
//         />
//       )}
//       <ToastContainer
//         position="top-right"
//         autoClose={5000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//     </DashboardLayout>
//   );
// };

// export default Subscription;