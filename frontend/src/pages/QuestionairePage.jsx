// src/components/QuestionnaireForm.js
import React, { useState, useEffect } from 'react';
import { Link} from "react-router-dom";
import logo from '../static/imgs/logo.png'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import { server } from '../server';
import { createQuestionaire } from '../redux/actions/questionaire'


const QuestionnaireForm = () => {
  const { success, error } = useSelector((state) => state.category);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [religion, setReligion] = useState("");
  const [gender, setGender] = useState("");
  const [relationshipStatus, setrelationshipStatus] = useState("");
  const [helpReason, sethelpReason] = useState("");
  const [optionsAvailable, setoptionsAvailable] = useState("");
  const [consultationFee, setconsultationFee] = useState("");
  const [therapyType, settherapyType] = useState("");
  const [categories, setCategories] = useState();




  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Category created successfully!");
      navigate("/");
    }
    axios.get(`${server}/category`, {withCredentials: true}).then((res) => {
      setCategories(res.data.categorys);
  })
  }, [error, success, navigate]);



  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      createQuestionaire({
        religion,
        gender,
        relationshipStatus,
        helpReason,
        optionsAvailable,
        consultationFee,
        therapyType
      })
    );
  };
  return (
    <div className="w-full bg-white">
    <div className="max-w-md mx-auto mt-8 p-4 shadow-md rounded">
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
          <select id="religion" name="religion" value={religion} onChange={(e) => setReligion(e.target.value)}
       className="mt-1 p-2 w-full border rounded-md">
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
          <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}  name="gender" className="mt-1 p-2 w-full border rounded-md">
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
            value={relationshipStatus}
            onChange={(e) => setrelationshipStatus(e.target.value)}
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
            value={helpReason}
            onChange={(e) => sethelpReason(e.target.value)}
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
            value={optionsAvailable}
            onChange={(e) => setoptionsAvailable(e.target.value)}
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
            value={consultationFee}
            onChange={(e) => setconsultationFee(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="therapyType" className="block text-sm font-medium text-gray-600">
            Types of Therapy
          </label>
          <select id="therapyType" 
          value={therapyType}
          onChange={(e) => sethelpReason(e.target.value)}
          name="therapyType" className="mt-1 p-2 w-full border rounded-md">
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
      
    </div>
    </div>
  );
};

export default QuestionnaireForm;
