import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackCircle } from 'react-icons/io5';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { RiErrorWarningLine } from 'react-icons/ri';

const SetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState('');

  // Extract token from the URL when the component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      alert('Invalid or missing token.');
      navigate('/login');
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    const newPassword = document.querySelector('input[placeholder="New Password"]').value;
    const confirmPassword = document.querySelector('input[placeholder="Confirm Password"]').value;

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Password updated successfully. Please log in with your new password.');
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-black text-white mt-[-50px] pt-[100px] pb-[50px]">
      <div className="w-full max-w-sm space-y-6 p-8 rounded-lg">
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
        <div className="text-center mt-4 text-xs">
          <a
            href="#"
            onClick={() => navigate('/login')}
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
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
