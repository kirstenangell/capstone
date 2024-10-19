import React, { useState } from 'react';
import { MdLocationPin, MdEmail } from "react-icons/md"; // Import the MdEmail icon
import { BsFillTelephoneFill } from "react-icons/bs";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/submit-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        setSubmitted(true);
      } else {
        setError(result.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setError('Failed to submit the form. Please try again.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white flex justify-center items-center px-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:space-x-20 space-y-12 md:space-y-0">
        {/* Contact Form */}
        <div className="w-full md:w-1/2">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2">CONTACT US</h2>
            <p className="text-base">Have a question or want to work together? Fill out the form and we'll get back to you as soon as possible.</p>
          </div>
          {submitted ? (
            <div className="text-center text-green-500">Thank you for your message! We will get back to you soon.</div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex flex-col md:flex-row md:space-x-6">
                <div className="w-full md:w-1/2">
                  <label className="block text-sm mb-2" htmlFor="name">Name</label>
                  <input
                    className="w-full p-3 bg-[#111] border border-gray-700 rounded"
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="w-full md:w-1/2 mt-4 md:mt-0">
                  <label className="block text-sm mb-2" htmlFor="email">Email</label>
                  <input
                    className="w-full p-3 bg-[#111] border border-gray-700 rounded"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-sm mb-2" htmlFor="message">Message</label>
                <textarea
                  className="w-full p-3 bg-[#111] border border-gray-700 rounded"
                  id="message"
                  placeholder="Enter your message"
                  style={{ height: '394px' }}
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>
              <button className="w-full p-3 bg-gradient-to-br from-[#4B88A3] to-[#000000] text-white rounded hover:opacity-90 transition-opacity duration-300" type="submit">Submit</button>
            </form>
          )}
        </div>
        {/* Map and Contact Information */}
        <div className="w-full md:w-1/2 flex flex-col space-y-8">
          <div className="mb-8">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d965.1558260108585!2d121.0597380696006!3d14.620522196795202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397b7955a40c083%3A0x8c28c5e98f9bcdc6!2sFlacko%20Auto%20Parts%20%26%20Accessories%20Trading!5e0!3m2!1sen!2sph!4v1724472095208!5m2!1sen!2sph"
              className="w-full border-none rounded"
              style={{ height: '492px' }}
              allowFullScreen=""
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="text-sm space-y-6">
            <div className="flex items-center space-x-2">
              <MdLocationPin className="text-lg" />
              <div>
                <p className="text-lg font-semibold">Flacko Auto Parts and Accessories</p>
                <p>Lorem ipsum Adit Dolores</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <BsFillTelephoneFill className="text-lg" />
              <div>
                <p>+1 (555) 555-5555</p>
                <p>Monday - Friday, 9am - 5pm</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MdEmail className="text-lg" />
              <div>
                <p>flackoautoparts@gmail.com</p>
                <p>Get in touch with us anytime!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
