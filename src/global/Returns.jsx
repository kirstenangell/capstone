import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';

const Returns = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const returnsPolicies = [
    {
      question: 'What is your return policy?',
      answer: 'Returns are accepted within 7 days of purchase, provided the items are unused and in their original packaging. Change of mind returns are not accepted. Returns will only be processed for defective, damaged, or incorrect items. An official receipt must be provided for all returns or claims related to defective items.',
    },
    {
      question: 'How do I initiate a return?',
      answer: 'To initiate a return, contact us at [phone/email] within 7 days to request a return authorization (RA#).  Items must be returned in person.',
    },
    {
      question: 'Store Credit & Refunds',
      answer: 'Approved returns will receive store credit for the full item value. Refunds are subject to approval and may be issued to the original payment method for defective or damaged items. For items that have been installed, a labor fee will be deducted from the refund or store credit. Please allow up to 10 business days for processing.',
    },
    {
      question: 'What items are non-returnable?',
      answer: 'Used interior accessories (e.g., seat covers, floor mats) and custom products cannot be returned unless defective.',
    },
  ];

  const handlePolicyClick = useCallback((index) => {
    setActiveIndex(activeIndex === index ? null : index);
  }, [activeIndex]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="mb-12 mx-auto max-w-3xl">
          <h2 className="text-left text-3xl font-bold mb-4">Return & Refunds</h2>
          <p className="text-left mb-12">Everything you need to know about our return and refund policy.</p>
          <div className="space-y-2">
            {returnsPolicies.map((policy, index) => (
              <div
                key={index}
                className={`p-4 rounded-md transition-all duration-300 ease-in-out ${activeIndex === index ? 'bg-gradient-to-br from-[#4B88A3] to-[#000000] shadow-lg' : 'bg-transparent'}`}
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
                <div className={`flex justify-between items-center transition-all duration-300 ease-in-out ${activeIndex === index ? 'py-4' : 'py-2'}`}>
                  <h3 className="text-lg font-medium">{policy.question}</h3>
                </div>
                <div
                  className={`transition-[max-height, opacity] duration-500 ease-in-out overflow-hidden ${activeIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
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

export default Returns;
