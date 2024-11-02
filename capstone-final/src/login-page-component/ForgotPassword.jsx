import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackCircle } from 'react-icons/io5'; // Correct
import { IoIosEye, IoIosEyeOff } from 'react-icons/io'; // Correct
import { RiErrorWarningLine } from 'react-icons/ri'; // Correct
import axios from 'axios';



const ForgotPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);

  const handleBackToLoginClick = () => {
    navigate('/login');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const emailInput = e.target.elements[0].value;
  
    try {
      const response = await axios.post('http://localhost:5000/forgot-password', { email: emailInput });
  
      if (response.status === 200) {
        alert('Password reset link sent to your email.');
        setIsPasswordReset(true); // Show new password form if needed
      }
    } catch (error) {
      console.error('Error sending reset request:', error);
      alert('Failed to send reset link. Please check your email and try again.');
    }
  };
  

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
    
  
  
  const handleSavePassword = async (event) => {
    event.preventDefault();
    const token = new URLSearchParams(window.location.search).get('token'); 
    const newPassword = event.target.elements[0].value;
  
    try {
      const response = await axios.post('http://localhost:5000/set-password', {
        token,
        newPassword
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
  


  return (
    <div className="min-h-screen flex items-start justify-center bg-black text-white mt-[-50px] pt-[100px] pb-[50px]"> 
      <div className="w-full max-w-sm space-y-6 p-8 rounded-lg">
        {isPasswordReset ? (
          <>
            <h1 className="text-2xl font-medium text-center mb-4">ENTER A NEW PASSWORD</h1>

            <form className="space-y-4" onSubmit={handleSavePassword}>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
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
          </>
        ) : (
          <>
            <h1 className="text-2xl font-medium text-center mb-4">FORGOT PASSWORD?</h1>
            <p className="text-center text-xs bg-gradient-to-r from-[#C9CACA] via-[#335C6E] to-[#62B1D4] bg-clip-text text-transparent mb-6">
              Enter your email address below to receive a password reset link
            </p>

            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div className="relative">
                <label className="text-xs mb-1 block">EMAIL ADDRESS</label>
                <input
                  type="email"
                  placeholder="user@gmail.com"
                  className="w-full p-3 bg-transparent border border-gray-700 rounded-md outline-none text-xs focus:border-blue-500 transition-colors"
                  style={{
                    background: 'linear-gradient(90deg, #040405, #335C6E)',
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-4 rounded-full text-sm font-semibold tracking-widest transition-all duration-300"
                style={{
                  background: 'linear-gradient(90deg, #040405, #335C6E)',
                }}
              >
                SUBMIT
              </button>
            </form>
          </>
        )}

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
                height: '16px',
              }}
            />
            Back to Login
          </a>
          <svg width="0" height="0">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%">
                <stop offset="0%" style={{ stopColor: '#62B1D4', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#335C6E', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
          </svg>
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

export default ForgotPassword;
