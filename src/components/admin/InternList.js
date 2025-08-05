import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

function InternList() {
    const [interns, setInterns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        fetchInterns();
    }, []);

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
        }
        setLoading(false);
    };

    const handleEdit = (intern) => {
        setEditingId(intern.id);
        setEditForm({
            name: intern.name || '',
            referralCode: intern.referralCode || '',
            donationsRaised: intern.donationsRaised || 0,
            username: intern.username || '',
            password: intern.password || ''
        });
    };

    const handleSave = async () => {
        try {
            const internRef = doc(db, 'interns', editingId);
            await updateDoc(internRef, {
                name: editForm.name,
                referralCode: editForm.referralCode,
                donationsRaised: Number(editForm.donationsRaised),
                username: editForm.username,
                password: editForm.password
            });
            setEditingId(null);
            setEditForm({});
            fetchInterns();
        } catch (error) {
            console.error("Error updating intern:", error);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteDoc(doc(db, 'interns', deleteId));
            setShowDeleteModal(false);
            setDeleteId(null);
            fetchInterns();
        } catch (error) {
            console.error("Error deleting intern:", error);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-gray-700 dark:text-gray-200">Loading interns...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">Manage Interns</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900/40">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Referral Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Donations</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Joining Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {interns.map((intern) => (
                                    <tr key={intern.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingId === intern.id ? (
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                                    className="border rounded px-2 py-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                                                />
                                            ) : (
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">{intern.name}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingId === intern.id ? (
                                                <input
                                                    type="text"
                                                    value={editForm.username}
                                                    onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                                                    className="border rounded px-2 py-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                                                />
                                            ) : (
                                                <div className="text-sm text-gray-500 dark:text-gray-300">{intern.username}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingId === intern.id ? (
                                                <input
                                                    type="text"
                                                    value={editForm.referralCode}
                                                    onChange={(e) => setEditForm({...editForm, referralCode: e.target.value})}
                                                    className="border rounded px-2 py-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                                                />
                                            ) : (
                                                <div className="text-sm text-gray-500 dark:text-gray-300">{intern.referralCode}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editingId === intern.id ? (
                                                <input
                                                    type="number"
                                                    value={editForm.donationsRaised}
                                                    onChange={(e) => setEditForm({...editForm, donationsRaised: e.target.value})}
                                                    className="border rounded px-2 py-1 w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                                                />
                                            ) : (
                                                <div className="text-sm text-gray-500 dark:text-gray-300">₹{intern.donationsRaised.toFixed(2)}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                            {intern.joiningDate ? new Date(intern.joiningDate.toDate()).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {editingId === intern.id ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={handleSave}
                                                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(intern)}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(intern.id)}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* confirmation for deletion modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <div className="mt-3 text-center">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-300 mb-4">
                                Are you sure you want to delete this intern? This action cannot be undone.
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default InternList; 