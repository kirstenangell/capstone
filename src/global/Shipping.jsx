import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar'; // Ensure Sidebar is imported

const Shipping = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const shippingPolicies = [
    {
      question: 'What are your shipping times?',
      answer: 'We process and ship orders promptly to ensure timely delivery. We process and ship orders during our business hours, which are from 8:00 AM to 6:00 PM, Monday to Saturday. Orders placed outside these hours or on Sundays will be processed on the next business day. Please note that delivery times may vary based on your location and the availability of the items.',
    },
    {
      question: 'How are shipping costs calculated?',
      answer: 'Shipping costs vary on the courier service you have selected. It may also base on the weight, size, and destination of your order. During checkout, the exact shipping fee will be displayed, ensuring transparency and convenience for our customers.',
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'We are pleased to offer international shipping to select locations. Additional fees and customs charges may apply based on the destination. Please contact us for more information or specific inquiries about international deliveries.',
    },
  ];

  const handlePolicyClick = useCallback(
    (index) => {
      setActiveIndex(activeIndex === index ? null : index);
    },
    [activeIndex]
  );

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mb-12 mx-auto max-w-3xl">
          <h2 className="text-left text-3xl font-bold mb-4">Shipping Policy</h2>
          <p className="text-left mb-12">
            Learn more about our shipping process, including delivery times and shipping costs.
          </p>
          <div className="space-y-2">
            {shippingPolicies.map((policy, index) => (
              <div
                key={index}
                className={`p-4 rounded-md transition-all duration-300 ease-in-out ${
                  activeIndex === index ? 'bg-gradient-to-br from-[#4B88A3] to-[#000000] shadow-lg' : 'bg-transparent'
                }`}
                style={{
                  background: activeIndex === index
                    ? 'linear-gradient(135deg, #4B88A3 0%, #000000 30%, #040405 70%, #4B88A3 90%)'
                    : 'transparent',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  overflow: 'hidden',
                  transition: 'background 300ms ease-in-out, box-shadow 300ms ease-in-out',
                }}
                onClick={() => handlePolicyClick(index)}
              >
                <div
                  className={`flex justify-between items-center transition-all duration-300 ease-in-out ${
                    activeIndex === index ? 'py-4' : 'py-2'
                  }`}
                >
                  <h3 className="text-lg font-medium">{policy.question}</h3>
                </div>
                <div
                  className={`transition-[max-height, opacity] duration-500 ease-in-out overflow-hidden ${
                    activeIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                  style={{ maxHeight: activeIndex === index ? '1000px' : '0' }}
                >
                  <p className="mt-4 text-sm">{policy.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
