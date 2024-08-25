import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-black p-10">
      <h3 className="text-xl font-bold mb-10">How can we help?</h3>
      <ul className="space-y-6">
        <li>
          <Link to="/faqs" className="cursor-pointer hover:text-blue-400">
            FAQs
          </Link>
        </li>
        <li>
          <Link to="/terms" className="cursor-pointer hover:text-blue-400">
            Terms of Service
          </Link>
        </li>
        <li>
          <Link to="/shipping" className="cursor-pointer hover:text-blue-400">
            Shipping Policy
          </Link>
        </li>
        <li>
          <Link to="/returns" className="cursor-pointer hover:text-blue-400">
            Return & Refunds
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
