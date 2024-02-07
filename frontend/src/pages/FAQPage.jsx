import React, { useState } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import SlideInOnScroll from './SlideInOnScroll';
import emailjs from 'emailjs-com';




const Contact = ({categoriesData}) => {
  return(
    <div>
      <Header activeHeading={5} categoriesData={categoriesData} />

      <SlideInOnScroll>
        <ContactForm />
      </SlideInOnScroll>

      <SlideInOnScroll>
          <Footer />
      </SlideInOnScroll>
    </div>
  )
}

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Replace with your EmailJS Service ID, Template ID, and User ID
    const serviceId = 'service_ris2vwj';
    const templateId = 'template_alo301e';
    const userId = 'Qr40OaloluqTkfltN';

    emailjs.send(serviceId, templateId, formData, userId)
      .then((response) => {
        console.log('Email sent successfully:', response.status, response.text);
        // Add your success message or redirect to a success page here
        // Reset form data
      setFormData({ name: '', email: '', message: '' });
      // Reload the page after sending the email
      window.location.reload();
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
        // Add your error handling logic here
      });
  };

  return (
    <form className="max-w-md mx-auto p-6 bg-pink-600 shadow-md rounded-md mt-8 mb-4">
      <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
      <div className="mb-4">
        <label className="block mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Message</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="w-full border rounded-md p-2 h-32 resize-none"
        ></textarea>
      </div>
      <button
        type="submit"
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Send Message
      </button>
    </form>
  );
};

export default Contact;
