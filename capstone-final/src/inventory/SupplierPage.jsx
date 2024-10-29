import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SupplierAddress from '../supplier-page-component/SupplierAddress';
import SupplierInformation from '../supplier-page-component/SupplierInformation';
import SupplierLanding from '../supplier-page-component/SupplierLanding';


export default function SupplierPage() {
    return (
        <Routes>
            <Route path="/" element={<SupplierLanding />} />
            <Route path="/supplier-information" element={<SupplierInformation />} />
        </Routes>
    );
}
