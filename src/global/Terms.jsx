import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar'; // Import your sidebar component if it's in a separate file

const Terms = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const sections = [
    {
      title: 'Introduction',
      content: 'Welcome to Flacko Auto Parts and Accessories Trading. By using our website and services, you agree to comply with and be bound by the following terms and conditions. These terms govern your use of our platform, products, and services to ensure a secure and reliable shopping experience.',
    },
    {
      title: 'User Obligations',
      content: 'As a user, you are responsible for providing accurate information during account registration, maintaining the confidentiality of your account credentials, and using the platform in a lawful manner. Misuse of the platform or violation of these terms may result in account suspension or termination.',
    },
    {
      title: 'Governing Law',
      content: 'These terms and conditions are governed by and construed in accordance with the laws of the Philippines. Any disputes arising under these terms shall be resolved exclusively by the courts within the jurisdiction of the Philippines.',
    },
  ];

  const handleSectionClick = useCallback((index) => {
    setActiveIndex(activeIndex === index ? null : index);
  }, [activeIndex]);

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div id="terms" className="mb-12 mx-auto max-w-3xl">
          <h2 className="text-left text-3xl font-bold mb-4">Terms of Service</h2>
          <p className="text-left mb-12">Please read through our terms of service to understand your rights and obligations.</p>
          <div className="space-y-2">
            {sections.map((section, index) => (
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
                onClick={() => handleSectionClick(index)}
              >
                <div className={`flex justify-between items-center transition-all duration-300 ease-in-out ${activeIndex === index ? 'py-4' : 'py-2'}`}>
                  <h3 className="text-lg font-medium">{section.title}</h3>
                </div>
                <div
                  className={`transition-[max-height, opacity] duration-500 ease-in-out overflow-hidden ${activeIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                  style={{ maxHeight: activeIndex === index ? '1000px' : '0' }}
                >
                  <p className="mt-4 text-sm">{section.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
