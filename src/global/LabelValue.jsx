// src/components/LabelValue.jsx
import React from 'react';

const LabelValue = ({ label, value }) => (
  <div className="flex justify-between items-center mb-2">
    <p className="text-xs text-gray-400 w-1/3">{label}:</p>
    <span className="text-white text-xs">{value}</span>
  </div>
);

export default LabelValue;
