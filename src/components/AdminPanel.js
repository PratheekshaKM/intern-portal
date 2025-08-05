import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InternList from './admin/InternList';
import AddIntern from './admin/AddIntern';
import AdminStats from './admin/AdminStats';

function AdminPanel() {
    const [activeTab, setActiveTab] = useState('stats');
    const [checkingAuth, setCheckingAuth] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const adminId = localStorage.getItem('adminId');
        if (!adminId) {
            localStorage.removeItem('internId');
            navigate('/');
        } else {
            setCheckingAuth(false);
        }
    }, [navigate]);

    if (checkingAuth) {
        return <div className="text-center py-8 text-gray-700 dark:text-gray-200">Checking admin access...</div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'stats':
                return <AdminStats />;
            case 'manage':
                return <InternList />;
            case 'add':
                return <AddIntern />;
            default:
                return <AdminStats />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'stats'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                            }`}
                        >
                            Dashboard Stats
                        </button>
                        <button
                            onClick={() => setActiveTab('manage')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'manage'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                            }`}
                        >
                            Manage Interns
                        </button>
                        <button
                            onClick={() => setActiveTab('add')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                activeTab === 'add'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                            }`}
                        >
                            Add Intern
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 text-gray-900 dark:text-white">
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminPanel; 