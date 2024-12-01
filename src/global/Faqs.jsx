import React, { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar'; // Import Sidebar

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { question: 'Do you offer warranties on the products sold?', answer: 'Yes, we do offer warranties, though they vary depending on the product. For car stereos, we provide a limited warranty ranging from 6 months to 1 year, based on the brand. For speakers, the warranty period is typically 3 to 5 days. Car LED lights are covered by a 6-month warranty, whereas regular lights do not come with a warranty, as we conduct thorough checks before installation or purchase. For tint installations, we offer product warranties on high-quality, branded tints such as Platinum and Diamond Ceramic, which are covered for 5 to 7 years. However, for brands like 3M or Lumina, we do not offer a product warranty. Regarding our installation services, we provide a warranty on the installation itself, which generally ranges from 3 to 7 days, depending on the specific service. Finally, for car alarms, both the product and installation are covered by a warranty of 3 to 6 months.' },
    { question: 'How can I claim a warranty?', answer: 'The process for claiming a warranty is simple and efficient. Customers are required to contact us to schedule an appointment and provide the necessary details of the product or service in question. It is essential that the customer presents the sales receipt, as this helps us verify warranty coverage. Once we have the relevant information, we will proceed with the warranty claim and assist the customer accordingly.' },
    { question: 'Do you offer discounts or promotions?', answer: 'We currently have an ongoing promotion. We are offering a special deal on tint installation or purchase for all types of vehicles, including cars, sedans, trucks, and vans. Customers who take advantage of this promotion will receive a complimentary car wash, which can be redeemed immediately following the purchase or saved for a future visit. This is an excellent opportunity for customers to receive added value with their purchase.' },
    { question: 'How do I book a service appointment?', answer: 'Customers can conveniently book an appointment through several methods. They can contact us via our Facebook page, call the store directly, or simply walk in. We strive to make the booking process as easy as possible, allowing customers to choose the method that works best for them.' },
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
