import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

function ThemeModal() {
    const { showThemeModal, selectTheme } = useTheme();
    const [selectedOption, setSelectedOption] = useState(null);

    if (!showThemeModal) return null;

    const handleThemeSelect = (theme) => {
        setSelectedOption(theme);
        setTimeout(() => {
            selectTheme(theme);
        }, 300);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-500 scale-100 animate-in fade-in-0 zoom-in-95">
                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Choose Your Theme
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            Select your preferred appearance for the best experience
                        </p>
                    </div>

                    {/* Theme Options */}
                    <div className="space-y-4">
                        {/* Light Mode */}
                        <button
                            onClick={() => handleThemeSelect('light')}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${selectedOption === 'light'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                                }`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Light Mode</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Clean and bright interface</p>
                                </div>
                            </div>
                        </button>

                        {/* Dark Mode */}
                        <button
                            onClick={() => handleThemeSelect('dark')}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${selectedOption === 'dark'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                                }`}
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">Easy on the eyes</p>
                                </div>
                            </div>
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            You can change this later in settings
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThemeModal; 