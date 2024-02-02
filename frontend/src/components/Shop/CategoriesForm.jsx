
import React, { useState } from 'react';
import axios from 'axios';

const CategoryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Replace 'YOUR_API_ENDPOINT' with your actual API endpoint
      const response = await axios.post('YOUR_API_ENDPOINT', formData);

      // Handle success
      console.log('Category created successfully:', response.data);
    } catch (error) {
      // Handle error
      console.error('Error creating category:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded-lg">
      <div className="mb-4">
        <label className="block text-pink-600 text-sm font-semibold">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border border-pink-500 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 text-sm font-semibold">Image URL:</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full p-2 border border-pink-500 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-pink-600 text-sm font-semibold">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border border-pink-500 rounded"
        />
      </div>
      <button type="submit" className="bg-pink-500 text-white py-2 px-4 rounded">
        Create Category
      </button>
    </form>
  );
};

export default CategoryForm;
