import { useState } from 'react';
import { db } from '../../firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

function AddIntern() {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        referralCode: '',
        donationsRaised: 0,
        joiningDate: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generateReferralCode = () => {
        const name = formData.name.toLowerCase().replace(/\s+/g, '');
        const year = new Date().getFullYear();
        return `${name}${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const internId = formData.username.toLowerCase().replace(/\s+/g, '-');

            // generate a new referral code if that field is left empty
            const referralCode = formData.referralCode || generateReferralCode();

            let joiningDateValue;
            if (formData.joiningDate) {
                joiningDateValue = new Date(formData.joiningDate);
            } else {
                joiningDateValue = serverTimestamp();
            }

            const internData = {
                name: formData.name,
                username: formData.username,
                password: formData.password,
                referralCode: referralCode,
                donationsRaised: Number(formData.donationsRaised),
                joiningDate: joiningDateValue
            };

            await setDoc(doc(db, 'interns', internId), internData);

            setMessage('Intern added successfully!');
            setFormData({
                name: '',
                username: '',
                password: '',
                referralCode: '',
                donationsRaised: 0,
                joiningDate: ''
            });
        } catch (error) {
            console.error("Error adding intern:", error);
            setMessage('Error adding intern. Please try again.');
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-6">Add New Intern</h3>

                    {message && (
                        <div className={`mb-4 p-3 rounded-md ${message.includes('Error')
                                ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            }`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Username *
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    required
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Enter username"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Enter password"
                                />
                            </div>

                            <div>
                                <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Referral Code
                                </label>
                                <input
                                    type="text"
                                    name="referralCode"
                                    id="referralCode"
                                    value={formData.referralCode}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="Leave empty to auto-generate"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Leave empty to auto-generate based on name
                                </p>
                            </div>

                            <div>
                                <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Joining Date
                                </label>
                                <input
                                    type="date"
                                    name="joiningDate"
                                    id="joiningDate"
                                    value={formData.joiningDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Leave empty to use the current date
                                </p>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="donationsRaised" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Initial Donations Raised (₹)
                                </label>
                                <input
                                    type="number"
                                    name="donationsRaised"
                                    id="donationsRaised"
                                    min="0"
                                    step="0.01"
                                    value={formData.donationsRaised}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setFormData({
                                    name: '',
                                    username: '',
                                    password: '',
                                    referralCode: '',
                                    donationsRaised: 0,
                                    joiningDate: ''
                                })}
                                className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
                            >
                                Clear Form
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                            >
                                {loading ? 'Adding...' : 'Add Intern'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Information</h4>
                <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1">
                    <li>• Username will be used for login credentials</li>
                    <li>• Referral code will be auto-generated if left empty</li>
                    <li>• Joining date will be automatically set to current date</li>
                    <li>• Initial donations can be set to 0 for new interns</li>
                </ul>
            </div>
        </div>
    );
}

export default AddIntern; 