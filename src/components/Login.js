import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

function Login() {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const [isAdmin, setIsAdmin] = useState(false);
     const navigate = useNavigate();

     const handleLogin = async (e) => {
          e.preventDefault();
          setError('');

          if (isAdmin) {
               if (username === 'admin' && password === 'admin123') {
                    localStorage.setItem('adminId', 'admin');
                    navigate('/admin');
                    return;
               } else {
                    setError('Invalid admin credentials');
                    return;
               }
          }

          try {
               const internsRef = collection(db, 'interns');
               const q = query(internsRef, where('username', '==', username), where('password', '==', password));
               const querySnapshot = await getDocs(q);

               if (!querySnapshot.empty) {
                    const internDoc = querySnapshot.docs[0];

                    localStorage.setItem('internId', internDoc.id);
                    navigate('/dashboard');
               } else {
                    setError('Invalid username or password');
               }
          } catch (err) {
               setError('Login failed. Please try again.');
               console.error('Login error:', err);
          }
     };

     return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
               <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-96 transform transition-all duration-300 hover:scale-105">

                    <div className="text-center mb-8">
                         <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                              </svg>
                         </div>
                         <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Intern Portal</h2>
                         <p className="text-gray-600 dark:text-gray-300">Welcome back! Please sign in to continue.</p>
                    </div>

                    {error && (
                         <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl">
                              {error}
                         </div>
                    )}

                    <div className="mb-6 flex items-center justify-center">
                         <label className="flex items-center cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                              <input
                                   type="checkbox"
                                   checked={isAdmin}
                                   onChange={(e) => setIsAdmin(e.target.checked)}
                                   className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                              />
                              <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Login as Admin</span>
                         </label>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                         <div>
                              <input
                                   type="text"
                                   placeholder={isAdmin ? "Admin Username" : "Username"}
                                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                                   value={username}
                                   onChange={(e) => setUsername(e.target.value)}
                              />
                         </div>
                         <div>
                              <input
                                   type="password"
                                   placeholder="Password"
                                   className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                              />
                         </div>
                         <button
                              type="submit"
                              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                         >
                              {isAdmin ? 'Admin Login' : 'Sign In'}
                         </button>
                    </form>

                    {/* footer */}
                    <div className="mt-8 text-center">
                         <p className="text-xs text-gray-500 dark:text-gray-400">
                              Secure access to your intern dashboard
                         </p>
                    </div>
               </div>
          </div>
     );
}

export default Login;
