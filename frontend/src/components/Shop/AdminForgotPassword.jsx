// ForgotPassword.js

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from "react-icons/fa"; 
import logo from '../../static/imgs/logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const AdminForgotPassword = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
  
    const handleForgotPassword = async () => {
      try {
        const response = await axios.post('https://your-backend-api.com/forgot-password', {
          email,
        });
  
        if (response.status === 200) {
          setMessage(response.data.message);
          navigate('/admin-check-password')
        } else {
          setError(response.data.error);
        }
      } catch (error) {
        console.error('Error sending password reset request:', error);
        setError('Something went wrong. Please try again later.');
      }
    };  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 shadow-md rounded-md w-96">
      <Link to="/">
        <img src={logo} alt='' style={{ height: '130px', width: '120px', display: 'flex', margin: '0 auto' }}
        />
      </Link>

      <Link to="/">
          {/* Home Icon Button */}
          <button className="absolute top-4 right-4 text-pink-600">
            <FaHome size={24} />
          </button>
      </Link>
        <h2 className="text-2xl font-semibold mb-4" style={{textAlign: 'center'}}>Admin Forgot Password</h2>

        {message && (
          <div className="mb-4 text-green-500">{message}</div>
        )}

        {error && (
          <div className="mb-4 text-red-500">{error}</div>
        )}

        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={handleForgotPassword}
        >
          Send Reset Email
        </button>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
