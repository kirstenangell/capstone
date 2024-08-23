import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from '../login-page-component/Login';
import ForgotPassword from '../login-page-component/ForgotPassword';
import SignUp from '../sign-up-page-component/SignUp';
import Confirmation from '../login-page-component/Confirmation';
import SetPassword from '../login-page-component/SetPassword';
import PasswordConfirmation from '../login-page-component/PasswordConfirmation';

export default function LoginPage() {
    const navigate = useNavigate();

    const handleForgotPasswordClick = () => {
        navigate('/login/forgot-password');
    };

    const handleSignUpClick = () => {
        navigate('/signup');
    };

    const handleForgotPasswordSubmit = () => {
        navigate('/login/confirmation');
    };

    const handleSetPasswordSubmit = () => {
        navigate('/login/set-password');
    };

    const handlePasswordSaved = () => {
        navigate('/login/password-confirmation'); 
    };

    return (
        <Routes>
            <Route 
                path="/" 
                element={<Login onForgotPasswordClick={handleForgotPasswordClick} onSignUpClick={handleSignUpClick} />} 
            />
            <Route 
                path="/forgot-password" 
                element={<ForgotPassword onSubmit={handleForgotPasswordSubmit} />} 
            />
            <Route 
                path="/signup" 
                element={<SignUp />} 
            />
            <Route 
                path="/confirmation" 
                element={<Confirmation onSetPasswordClick={handleSetPasswordSubmit} />} 
            />
            <Route 
                path="/set-password" 
                element={<SetPassword onSubmit={handlePasswordSaved} />} // Pass handlePasswordSaved as the onSubmit prop
            />
            <Route 
                path="/password-confirmation" 
                element={<PasswordConfirmation />} // Add route for PasswordConfirmation component
            />
        </Routes>
    );
}
