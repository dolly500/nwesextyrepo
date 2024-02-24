// src/components/QuestionnaireForm.js
import React, { useState } from 'react';
import { Link} from "react-router-dom";
import logo from '../static/imgs/logo.png'

const QuestionnaireForm = () => {
    const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Mock API call - replace this with your actual API endpoint
      const response = await fetch('https://api.example.com/submit-questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Include form data here
          religion: e.target.religion.value,
          gender: e.target.gender.value,
          relationshipStatus: e.target.relationshipStatus.value,
          // ... other form fields
        }),
      });

      if (response.ok) {
        // Form submitted successfully
        setShowPopup(true);
      } else {
        // Handle error scenarios
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="bg-white">
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded">
        <Link to="/">
              <img
                src= {logo}
                alt=""
                style={{ height: '130px', width: '120px', display: 'flex', margin: '0 auto'}} 
              />
      </Link>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Fill in Questionaire
        </h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="religion" className="block text-sm font-medium text-gray-600">
            Religion
          </label>
          <select id="religion" name="religion" className="mt-1 p-2 w-full border rounded-md">
          <option></option>
            <option>Christianity</option>
            <option>Islam</option>
            <option>Others</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="gender" className="block text-sm font-medium text-gray-600">
            Gender
          </label>
          <select id="gender" name="gender" className="mt-1 p-2 w-full border rounded-md">
          <option></option>
            <option>Male</option>
            <option>Female</option>
            <option>Others</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="relationshipStatus" className="block text-sm font-medium text-gray-600">
            Relationship Status
          </label>
          <select
            id="relationshipStatus"
            name="relationshipStatus"
            className="mt-1 p-2 w-full border rounded-md"
          >
            <option></option>
            <option>Single</option>
            <option>Married</option>
            <option>Divorced</option>
            <option>Separated</option>
            <option>Others</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="helpReason" className="block text-sm font-medium text-gray-600">
            What are you seeking help for?
          </label>
          <input
            type="text"
            id="helpReason"
            name="helpReason"
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="optionsAvailable" className="block text-sm font-medium text-gray-600">
            Options available
          </label>
          <select
            id="optionsAvailable"
            name="optionsAvailable"
            className="mt-1 p-2 w-full border rounded-md"
          >
            <option></option>
            <option>Your sex life</option>
            <option>Differences with your spouse</option>
            <option>Divorce</option>
            <option>Adoption</option>
            <option>Infertility</option>
            <option>Infidelity</option>
            <option>Pregnancy</option>
            <option>Postpartum depression</option>
            <option>Others</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-600">
            Initial Consultation Fee
          </label>
          <input
            type="text"
            id="consultationFee"
            name="consultationFee"
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="therapyType" className="block text-sm font-medium text-gray-600">
            Types of Therapy
          </label>
          <select id="therapyType" name="therapyType" className="mt-1 p-2 w-full border rounded-md">
          <option></option>
            <option value="individual">Individual</option>
            <option value="couples">Couples</option>
            <option value="teens">Teens</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-white p-4 rounded-md">
            <p className="text-center text-green-600 font-bold">
              You have successfully filled the Questionnaire. Thank you!
            </p>
            <button
              onClick={closePopup}
              className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default QuestionnaireForm;
