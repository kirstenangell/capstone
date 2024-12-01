import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CustomerLanding from '../customer-page-component/CustomerLanding';
import CustomerInformation from '../customer-page-component/CustomerInformation';
import CustomerAddress from '../customer-page-component/CustomerAddress';

export default function CustomerPage() {
    return (
        <Routes>
            <Route path="/" element={<CustomerLanding />} />
            <Route path="/customer-information" element={<CustomerInformation />} />
            <Route path="/customer-address" element={<CustomerAddress/>} />
        </Routes>
    );
}
