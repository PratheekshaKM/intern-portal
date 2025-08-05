import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

function Leaderboard() {
     const [interns, setInterns] = useState([]);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);

     useEffect(() => {
          const fetchInterns = async () => {
               try {
                    const querySnapshot = await getDocs(collection(db, 'interns'));
                    const internsList = querySnapshot.docs.map(doc => ({
                         id: doc.id,
                         ...doc.data(),
                         donationsRaised: Number(doc.data().donationsRaised) || 0
                    }));
                    setInterns(internsList.sort((a, b) => {
                        const dateA = a.joiningDate?.toDate ? a.joiningDate.toDate() : new Date(a.joiningDate || 0);
                        const dateB = b.joiningDate?.toDate ? b.joiningDate.toDate() : new Date(b.joiningDate || 0);
                        return dateA - dateB; // sorting by joining date
                    }));
               } catch (error) {
                    console.error("Error fetching interns:", error);
                    setError("Failed to load leaderboard data");
               }
               setLoading(false);
          };

          fetchInterns();
     }, []);

     if (loading) return <div className="text-center mt-8 text-gray-700 dark:text-gray-200">Loading...</div>;
     if (error) return <div className="text-center mt-8 text-red-500 dark:text-red-400">{error}</div>;

     return (
          <div className="max-w-4xl mx-auto p-6">
               <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leaderboard</h1>
                    <Link to="/dashboard" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
                         Back to Dashboard
                    </Link>
               </div>

               <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                         <div className="grid grid-cols-4 font-semibold text-gray-900 dark:text-white">
                              <div>Rank</div>
                              <div>Name</div>
                              <div>Referral Code</div>
                              <div>Donations</div>
                         </div>
                    </div>
                    {interns.map((intern, index) => (
                         <div key={intern.id} className="p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                              <div className="grid grid-cols-4 text-gray-900 dark:text-white">
                                   <div className="font-medium">{index + 1}</div>
                                   <div>{intern.name || 'N/A'}</div>
                                   <div className="text-gray-600 dark:text-gray-300">{intern.referralCode || 'N/A'}</div>
                                   <div className="font-semibold text-green-600 dark:text-green-400">₹{(intern.donationsRaised || 0).toFixed(2)}</div>
                              </div>
                         </div>
                    ))}
               </div>
          </div>
     );
}

export default Leaderboard;
