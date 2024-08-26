import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import Sidebar

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { question: 'Do you offer warranties on the products sold?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { question: 'How can I claim a warranty?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { question: 'Do you offer discounts or promotions?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { question: 'How do I book a service appointment?', answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
  ];

  const handleFaqClick = useCallback((index) => {
    setActiveIndex(activeIndex === index ? null : index);
  }, [activeIndex]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar /> {/* Sidebar included */}
      <div className="flex-1 p-6">
        <div id="faqs" className="mb-12 mx-auto max-w-3xl">
          <h2 className="text-left text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-left mb-12">Everything you need to know about Flacko Autoparts and Accessories</p>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`p-4 rounded-md transition-all duration-300 ease-in-out ${activeIndex === index ? 'bg-gradient-to-br from-[#4B88A3] to-[#000000] shadow-lg' : 'bg-transparent'}`}
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' }}
                onClick={() => handleFaqClick(index)}
              >
                <div className={`flex justify-between items-center ${activeIndex === index ? 'py-4' : 'py-2'}`}>
                  <h3 className="text-lg font-medium">{faq.question}</h3>
                </div>
                <div className={`transition-[max-height, opacity] duration-500 ease-in-out ${activeIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`} style={{ maxHeight: activeIndex === index ? '1000px' : '0' }}>
                  <p className="mt-4 text-sm">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faqs;
