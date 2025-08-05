import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

function Navigation() {
    const navigate = useNavigate();
    const internId = localStorage.getItem('internId');
    const adminId = localStorage.getItem('adminId');
    const isLoggedIn = internId || adminId;

    const handleLogout = () => {
        localStorage.removeItem('internId');
        localStorage.removeItem('adminId');
        navigate('/');
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                            <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m0 0c-4.418 0-8-1.79-8-4V10m8 10c4.418 0 8-1.79 8-4V10" />
                                </svg>
                            </span>
                            Intern Portal
                        </Link>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        {isLoggedIn && (
                            <>
                                {internId && (
                                    <Link 
                                        to="/dashboard" 
                                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <Link 
                                    to="/leaderboard" 
                                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Leaderboard
                                </Link>
                                {adminId && (
                                    <Link 
                                        to="/admin" 
                                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Admin Panel
                                    </Link>
                                )}
                            </>
                        )}
                        
                        <ThemeToggle />
                        
                        {isLoggedIn && (
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm font-medium"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navigation; 