import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the token from the URL query parameters
  const token = new URLSearchParams(location.search).get('token');


  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/verify-email?token=${token}`);
        setMessage(response.data.message);
      } catch (error) {
        setMessage('Verification failed. Please try again.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setMessage('Invalid verification token.');
    }
  }, [token]);

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '50px' }}>
      <h1 style={{ color: '#28a745' }}>{message}</h1>
      {message === 'Email successfully verified!' && (
        <button
          onClick={() => navigate('/login')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Continue to Your Account
        </button>
      )}
    </div>
  );
};

export default VerifyEmail;
