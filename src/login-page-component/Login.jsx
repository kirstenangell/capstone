import React, { useState, useEffect } from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const [timeoutId, setTimeoutId] = useState(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            if (response.status === 200) {
                const { userData, role } = response.data; // Destructure correctly
                console.log('Login Successful:', userData); // Debugging line
                localStorage.setItem('userId', userData.id); // Save userId
                localStorage.setItem('email', userData.email);
                localStorage.setItem('firstName', userData.firstName);
                localStorage.setItem('lastName', userData.lastName);

                if (typeof setIsLoggedIn === 'function') {
                    setIsLoggedIn(true);
                    localStorage.setItem('isLoggedIn', 'true');
                }

                // Start session timer
                startSessionTimer();

                if (role === 'admin') {
                    navigate('/dashboard');
                } else if (role === 'customer') {
                    navigate('/manage-account');
                }
            } else {
                setErrorMessage(response.data.message);
            }
        } catch (error) {
            setErrorMessage('An error occurred during login.');
            console.error('Login error:', error);
        }
    };

    const startSessionTimer = () => {
        clearTimeout(timeoutId); // Clear any existing timeout
        const id = setTimeout(() => {
            handleLogout();
        }, 900000); // 15 minutes (15 * 60 * 1000)
        setTimeoutId(id);
    };
    

    const handleLogout = () => {
        localStorage.clear();
        if (typeof setIsLoggedIn === 'function') {
            setIsLoggedIn(false);
        }
        navigate('/login');
        alert('You have been logged out due to inactivity.');
    };

    const resetTimer = () => {
        startSessionTimer();
    };

    useEffect(() => {
        // Add event listeners to reset the timer on user activity
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);

        return () => {
            // Clean up event listeners when the component unmounts
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
        };
    }, []);

    return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white py-[50px]">
            <div className="w-full max-w-sm space-y-6 p-8 rounded-lg">
                <h1 className="text-2xl font-medium text-center mb-4">WELCOME BACK!</h1>

                <form className="space-y-4" onSubmit={handleLogin}>
                    <div className="relative">
                        <label className="text-xs mb-1 block">EMAIL ADDRESS</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
                            style={{
                                background: 'linear-gradient(90deg, #040405, #335C6E)',
                            }}
                        />
                    </div>

                    <div className="relative">
                        <label className="text-xs mb-1 block">PASSWORD</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
                            style={{
                                background: 'linear-gradient(90deg, #040405, #335C6E)',
                            }}
                        />
                        <div
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer mt-5"
                        >
                            {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                        <label className="flex items-center space-x-2">
                            <input type="checkbox" className="form-checkbox text-blue-500" />
                            <span>Remember Me</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => navigate('/login/forgot-password')}
                            className="hover:underline bg-gradient-to-r from-[#C9CACA] via-[#335C6E] to-[#62B1D4] bg-clip-text text-transparent"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 mt-4 rounded-full text-sm font-semibold tracking-widest transition-all duration-300"
                        style={{
                            background: 'linear-gradient(90deg, #040405, #335C6E)',
                        }}
                    >
                        LOG IN
                    </button>

                    {errorMessage && (
                        <div className="text-red-500 text-xs text-center mt-2">
                            {errorMessage}
                        </div>
                    )}
                </form>

                <div className="text-center mt-4 text-xs">
                    <span>Don't have an account? </span>
                    <a
                        href="/signup"
                        className="hover:underline bg-gradient-to-r from-[#C9CACA] via-[#335C6E] to-[#62B1D4] bg-clip-text text-transparent"
                    >
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
