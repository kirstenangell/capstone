import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { IoArrowBackCircle } from 'react-icons/io5';
import { RiErrorWarningLine } from 'react-icons/ri';
import axios from 'axios';

const SetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState(''); // Added state for new password
  const [confirmPassword, setConfirmPassword] = useState(''); // Added state for confirm password
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSavePassword = async (event) => {
    event.preventDefault();
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token || newPassword !== confirmPassword) {
      alert('Passwords do not match or token is missing.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/set-password', {
        token,
        newPassword,
      });

      if (response.status === 200) {
        alert('Password updated successfully.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
    }
  };

  const handleBackToLoginClick = () => {
    navigate('/login');
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white py-[50px]">
      <div className="w-full max-w-sm space-y-6 p-8 rounded-lg">
        <h1 className="text-2xl font-medium text-center mb-4">ENTER A NEW PASSWORD</h1>

        <form className="space-y-4" onSubmit={handleSavePassword}>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
              style={{
                background: 'linear-gradient(90deg, #040405, #335C6E)',
              }}
            />
            <div
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer mt-1"
            >
              {showPassword ? <IoIosEye /> : <IoIosEyeOff />}
            </div>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
              style={{
                background: 'linear-gradient(90deg, #040405, #335C6E)',
              }}
            />
            <div
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 cursor-pointer mt-1"
            >
              {showConfirmPassword ? <IoIosEye /> : <IoIosEyeOff />}
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 mt-2 flex items-center">
              <RiErrorWarningLine
                className="mr-1"
                style={{
                  fill: 'url(#grad1)',
                  width: '14px',
                  height: '14px',
                }}
              />
              Must be at least 8 characters
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-4 rounded-full text-sm font-semibold tracking-widest transition-all duration-300"
            style={{
              background: 'linear-gradient(90deg, #040405, #335C6E)',
            }}
          >
            SAVE
          </button>
        </form>

        <div className="text-center mt-4 text-xs">
          <a
            href="#"
            onClick={handleBackToLoginClick}
            className="flex items-center justify-center hover:underline bg-gradient-to-r from-[#C9CACA] via-[#335C6E] to-[#62B1D4] bg-clip-text text-transparent"
          >
            <IoArrowBackCircle
              className="mr-1"
              style={{
                fill: 'url(#grad1)',
                width: '16px',
              }}
            />
            Back to Login
          </a>
        </div>

        <div className="text-center mt-4 text-xs">
          <span>Don't have an account? </span>
          <a
            href="#"
            onClick={() => navigate('/signup')}
            className="hover:underline bg-gradient-to-r from-[#C9CACA] via-[#335C6E] to-[#62B1D4] bg-clip-text text-transparent"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
