import React, { useState } from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';

const Login = ({ onForgotPasswordClick, onSignUpClick, onLoginSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // You would normally validate the user input and handle authentication here
        onLoginSuccess(); // Redirect to ManageAcc after successful login
    };

    return (
        <div className="min-h-screen flex items-start justify-center bg-black text-white mt-[-50px] pt-[100px] pb-[50px]"> 
            <div className="w-full max-w-sm space-y-6 p-8 rounded-lg">
                <h1 className="text-2xl font-medium text-center mb-4">WELCOME BACK!</h1>

                <form className="space-y-4" onSubmit={handleLoginSubmit}>
                    <div className="relative">
                        <label className="text-xs  mb-1 block">EMAIL ADDRESS</label>
                        <input
                            type="email"
                            placeholder="Enter email"
                            className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
                            style={{
                                background: 'linear-gradient(90deg, #040405, #335C6E)',
                            }}
                        />
                    </div>

                    <div className="relative">
                        <label className="text-xs  mb-1 block">PASSWORD</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter password"
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
                        <a
                            href="#"
                            className= "hover:underline bg-gradient-to-r from-[#C9CACA] via-[#335C6E] to-[#62B1D4] bg-clip-text text-transparent"
                            onClick={onForgotPasswordClick}
                        >
                            Forgot Password?
                        </a>
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
                </form>

                <div className="text-center mt-4 text-xs">
                    <span>Don't have an account? </span>
                    <a
                        href="#"
                        className="hover:underline bg-gradient-to-r from-[#C9CACA] via-[#335C6E] to-[#62B1D4] bg-clip-text text-transparent"
                        onClick={onSignUpClick}
                    >
                        Sign Up
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Login;
