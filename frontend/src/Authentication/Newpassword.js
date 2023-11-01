import React, { useState } from 'react';
import { useLocation,useNavigate } from 'react-router-dom';
import axios from 'axios';
const Newpassword = () => {
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const navigate = useNavigate();
    const location = useLocation();
    const [passwordMatch, setPasswordMatch] = useState(true);

    const handlePasswordChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    
        if (passwords.newPassword !== passwords.confirmPassword) {
            setPasswordMatch(false);
        } else {
            // Passwords match, call the "forgot" API to update the password
            const newPassword = passwords.newPassword;
            axios
                .post('http://localhost:8081/forgot', {
                    email: location.state.email,
                    newPassword: newPassword
                })
                .then((res) => {
                    // Handle the response from the "forgot" API
                    console.log('Forgot API response:', res.data);
    
                    // If the password update is successful, navigate to the login page
                    if (res.data.message === 'Password updated successfully') {
                        navigate('/');
                    } else {
                        console.log('Password update failed');
                    }
                })
                .catch((err) => {
                    console.log(err);
                    // Handle API error if needed
                });
        }
    };
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Reset Password
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="newPassword" className="sr-only">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="New Password"
                                value={passwords.newPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirm Password"
                                value={passwords.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </div>
                    {!passwordMatch && (
                        <p className="mt-2 text-sm text-red-600">
                            Passwords do not match.
                        </p>
                    )}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-but transform hover:scale-105 transition ease out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Newpassword;
