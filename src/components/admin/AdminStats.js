import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

function AdminStats() {
    const [stats, setStats] = useState({
        totalInterns: 0,
        totalDonations: 0,
        averageDonations: 0,
        topPerformer: null,
        recentInterns: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'interns'));
                const internsList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    donationsRaised: Number(doc.data().donationsRaised) || 0
                }));

                const totalDonations = internsList.reduce((sum, intern) => sum + intern.donationsRaised, 0);
                const averageDonations = internsList.length > 0 ? totalDonations / internsList.length : 0;

                // Top performer logic: if tie, pick earliest joiningDate
                let topPerformer = null;
                if (internsList.length > 0) {
                    const maxDonation = Math.max(...internsList.map(i => i.donationsRaised));
                    const topCandidates = internsList.filter(i => i.donationsRaised === maxDonation);
                    topPerformer = topCandidates.reduce((earliest, curr) => {
                        if (!earliest) return curr;
                        if (!curr.joiningDate || !earliest.joiningDate) return earliest;
                        const currDate = curr.joiningDate.toDate ? curr.joiningDate.toDate() : new Date(curr.joiningDate);
                        const earliestDate = earliest.joiningDate.toDate ? earliest.joiningDate.toDate() : new Date(earliest.joiningDate);
                        return currDate < earliestDate ? curr : earliest;
                    }, null);
                }

                const recentInterns = internsList
                    .sort((a, b) => {
                        const dateA = a.joiningDate?.toDate ? a.joiningDate.toDate() : new Date(a.joiningDate || 0);
                        const dateB = b.joiningDate?.toDate ? b.joiningDate.toDate() : new Date(b.joiningDate || 0);
                        return dateA - dateB; // Earliest first
                    })
                    .slice(0, 5);

                setStats({
                    totalInterns: internsList.length,
                    totalDonations,
                    averageDonations,
                    topPerformer,
                    recentInterns
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-center py-8 text-gray-700 dark:text-gray-200">Loading statistics...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Total Interns</dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">{stats.totalInterns}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Total Donations</dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">₹{stats.totalDonations.toFixed(2)}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Average Donations</dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">₹{stats.averageDonations.toFixed(2)}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-300 truncate">Top Performer</dt>
                                    <dd className="text-lg font-medium text-gray-900 dark:text-white">
                                        {stats.topPerformer ? stats.topPerformer.name : 'N/A'}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Interns */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">Recent Interns</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900/40">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Referral Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Donations</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joining Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {stats.recentInterns.map((intern) => (
                                    <tr key={intern.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                            {intern.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {intern.referralCode}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            ₹{intern.donationsRaised.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {intern.joiningDate ? new Date(intern.joiningDate.toDate()).toLocaleDateString() : 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminStats; 