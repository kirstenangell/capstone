import React, { useState, useCallback } from 'react';

const Faqs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [transitioningIndex, setTransitioningIndex] = useState(null);

  const faqs = [
    {
      question: 'Do you offer warranties on the products sold?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla neque quam, maximus in sagittis quis, sollicitudin non nisi. Mauris aliquet, dolor eget laoreet facilisis, justo arcu vehicula metus.',
    },
    {
      question: 'How can I claim a warranty?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      question: 'Do you offer discounts or promotions?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      question: 'How do I book a service appointment?',
      answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ];

  const handleFaqClick = useCallback((index) => {
    if (activeIndex === index) {
      setTransitioningIndex(index);
      setTimeout(() => {
        setActiveIndex(null);
        setTransitioningIndex(null);
      }, 300); // Adjust timing to match the transition duration
    } else {
      setActiveIndex(index);
      setTransitioningIndex(null);
    }
  }, [activeIndex]);

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl px-4 py-12">
        <h2 className="text-center text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-center mb-12">Everything you need to know about Flacko Autoparts and Accessories</p>
        <div className="space-y-2">
          {faqs.map((faq, index) => (
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
              onClick={() => handleFaqClick(index)}
            >
              <div className={`flex justify-between items-center transition-all duration-300 ease-in-out ${activeIndex === index ? 'py-4' : 'py-2'}`}>
                <h3 className="text-lg font-medium">{faq.question}</h3>
              </div>
              <div
                className={`transition-[max-height, opacity] duration-500 ease-in-out overflow-hidden ${activeIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                style={{ maxHeight: activeIndex === index ? '1000px' : '0' }}
              >
                <p className="mt-4 text-sm">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faqs;
