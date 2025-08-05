import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

function Dashboard() {
     const [internData, setInternData] = useState(null);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
          const fetchInternData = async () => {
               const internId = localStorage.getItem('internId');
               if (!internId) {
                    window.location.href = '/';
                    return;
               }

               try {
                    const internDoc = await getDoc(doc(db, 'interns', internId));
                    if (internDoc.exists()) {
                         setInternData(internDoc.data());
                    } else {
                         console.error('Intern not found');
                         localStorage.removeItem('internId');
                         window.location.href = '/';
                    }
               } catch (error) {
                    console.error('Error fetching intern data:', error);
               }
               setLoading(false);
          };

          fetchInternData();
     }, []);

     if (loading) {
          return <div className="text-center py-8 text-gray-700 dark:text-gray-200">Loading...</div>;
     }

     if (!internData) {
          return <div className="text-center py-8 text-red-600 dark:text-red-400">Error loading intern data</div>;
     }

     // to calculate the number of days from the date intern has joined
     const joiningDate = internData.joiningDate?.toDate ? internData.joiningDate.toDate() : new Date(internData.joiningDate);
     const daysAsIntern = Math.floor((new Date() - joiningDate) / (1000 * 60 * 60 * 24));

     return (
          <div className="max-w-6xl mx-auto p-6">
               {/* Header */}
               <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Intern Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-300">Welcome back, {internData?.name}!</p>
               </div>

               {/* Stats card  */}
               <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Stats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl border border-blue-200 dark:border-blue-700">
                              <div className="flex items-center justify-between">
                                   <div>
                                        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Name</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{internData?.name}</p>
                                   </div>
                                   <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                   </div>
                              </div>
                         </div>

                         <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl border border-indigo-200 dark:border-indigo-700">
                              <div className="flex items-center justify-between">
                                   <div>
                                        <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium">Username</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{internData?.username || 'N/A'}</p>
                                   </div>
                                   <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                   </div>
                              </div>
                         </div>

                         <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl border border-orange-200 dark:border-orange-700">
                              <div className="flex items-center justify-between">
                                   <div>
                                        <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Referral Code</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{internData?.referralCode || 'N/A'}</p>
                                   </div>
                                   <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                        </svg>
                                   </div>
                              </div>
                         </div>

                         <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl border border-green-200 dark:border-green-700">
                              <div className="flex items-center justify-between">
                                   <div>
                                        <p className="text-green-600 dark:text-green-400 text-sm font-medium">Donations Raised</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{internData?.donationsRaised?.toFixed(2) || '0.00'}</p>
                                   </div>
                                   <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                        </svg>
                                   </div>
                              </div>
                         </div>

                         <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl border border-red-200 dark:border-red-700">
                              <div className="flex items-center justify-between">
                                   <div>
                                        <p className="text-red-600 dark:text-red-400 text-sm font-medium">Joining Date</p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                             {internData?.joiningDate ? new Date(internData.joiningDate.toDate()).toLocaleDateString() : 'N/A'}
                                        </p>
                                   </div>
                                   <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                   </div>
                              </div>
                         </div>

                         <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl border border-purple-200 dark:border-purple-700">
                              <div className="flex items-center justify-between">
                                   <div>
                                        <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Days as Intern</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{daysAsIntern}</p>
                                   </div>
                                   <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Rewards and unlockables */}
               <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Rewards & Unlockables</h2>
                    <div className="space-y-4">
                         <div className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                              <div className={`w-8 h-8 flex items-center justify-center border-2 rounded-lg mr-4 transition-all duration-300 ${internData.donationsRaised >= 2500
                                        ? 'bg-green-100 border-green-500 text-green-500 dark:bg-green-900/20 dark:border-green-400 dark:text-green-400'
                                        : 'border-gray-300 dark:border-gray-600'
                                   }`}>
                                   {internData.donationsRaised >= 2500 && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                   )}
                              </div>
                              <div>
                                   <span className={`font-medium ${internData.donationsRaised >= 1000 ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                        Raise ₹2,500 - Exclusive T-shirt
                                   </span>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">Get your custom made t-shirt!</p>
                              </div>
                         </div>

                         <div className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                              <div className={`w-8 h-8 flex items-center justify-center border-2 rounded-lg mr-4 transition-all duration-300 ${internData.donationsRaised >= 5000
                                        ? 'bg-green-100 border-green-500 text-green-500 dark:bg-green-900/20 dark:border-green-400 dark:text-green-400'
                                        : 'border-gray-300 dark:border-gray-600'
                                   }`}>
                                   {internData.donationsRaised >= 5000 && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                   )}
                              </div>
                              <div>
                                   <span className={`font-medium ${internData.donationsRaised >= 2500 ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                        Raise ₹5,000 - Goodies and Swag Bag
                                   </span>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">Get our Goodies and Swag bag and many more..</p>
                              </div>
                         </div>

                         <div className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                              <div className={`w-8 h-8 flex items-center justify-center border-2 rounded-lg mr-4 transition-all duration-300 ${internData.donationsRaised >= 10000
                                        ? 'bg-green-100 border-green-500 text-green-500 dark:bg-green-900/20 dark:border-green-400 dark:text-green-400'
                                        : 'border-gray-300 dark:border-gray-600'
                                   }`}>
                                   {internData.donationsRaised >= 10000 && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                   )}
                              </div>
                              <div>
                                   <span className={`font-medium ${internData.donationsRaised >= 5000 ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                        Raise ₹10,000 - LOR (Letter of Recommendation)
                                   </span>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">Get a Letter of Reccomendation from our HR</p>
                              </div>
                         </div>

                         <div className="flex items-center p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                              <div className={`w-8 h-8 flex items-center justify-center border-2 rounded-lg mr-4 transition-all duration-300 ${internData.donationsRaised >= 20000
                                        ? 'bg-green-100 border-green-500 text-green-500 dark:bg-green-900/20 dark:border-green-400 dark:text-green-400'
                                        : 'border-gray-300 dark:border-gray-600'
                                   }`}>
                                   {internData.donationsRaised >= 20000 && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                   )}
                              </div>
                              <div>
                                   <span className={`font-medium ${internData.donationsRaised >= 10000 ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                        Raise ₹20,000 - Extension of Internship for 3 more months
                                   </span>
                                   <p className="text-sm text-gray-500 dark:text-gray-400">Opportunity for full-time role</p>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     );
}

export default Dashboard;