import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InventoryLanding from '../inventory-page-component/InventoryLanding'; 
import ProductInformation from '../inventory-page-component/ProductInformation';

const InventoryPage = () => {
  return (
    <Routes>
      <Route path="/*" element={<InventoryLanding />} />
      <Route path="/product-information/:id" element={<ProductInformation />} />
    </Routes>
  );
};

export default InventoryPage;
