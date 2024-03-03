import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import { Link } from 'react-router-dom';
import logo from '../../static/imgs/logo.png';
import { FaHome } from "react-icons/fa"; 

const AdminCheckPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    if (newPassword === '' || confirmPassword === '') {
      setError('Please fill in all fields.');
    } else if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
    } else {
      try {
        // Make an API call to update the user's password
        const response = await axios.post('/api/reset-password', {
          newPassword,
        });

        // Check the response from the server
        if (response.data.success) {
          // Password reset successful
          setNewPassword('');
          setConfirmPassword('');
          setError('');
          alert('Password reset successful!');
        } else {
          // Handle the case where the server indicates an error
          setError('Password reset failed. Please try again.');
        }
      } catch (error) {
        // Handle any error that occurred during the API call
        setError('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="w-96 p-8 bg-white shadow-md rounded-md">
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

        <h2 className="text-2xl font-bold mb-4">Admin Check Password</h2>
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            className="w-full border rounded-md p-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="w-full border rounded-md p-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          onClick={handleResetPassword}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default AdminCheckPassword;
