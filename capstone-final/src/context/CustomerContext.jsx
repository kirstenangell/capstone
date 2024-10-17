// src/context/CustomerContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const CustomerContext = createContext();

// Default customers (for initial data)
const defaultCustomers = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    type: "Individual",
    source: "Manual Add",
    phone: "+63 000 000 0000",
    email: "juandelacruz@gmail.com",
    status: "Active",
    currentAddress: {
      street: "1234 Elm Street",
      city: "Quezon City",
      province: "Metro Manila",
      zipCode: "1100",
      landmark: "Near SM QC",
    },
    orders: [
      { id: 'OID-0000', item: 'Electrical System', price: '₱1,000.00', status: 'Paid' },
      { id: 'OID-0001', item: 'HVAC System', price: '₱5,000.00', status: 'Pending' },
    ],
  },
  {
    id: 2,
    name: "Maria Santos",
    type: "Individual",
    source: "Online Registration",
    phone: "+63 987 654 3210",
    email: "mariasantos@gmail.com",
    status: "Inactive",
    currentAddress: {
      street: "5678 Maple Avenue",
      city: "Makati City",
      province: "Metro Manila",
      zipCode: "1200",
      landmark: "Near Glorietta",
    },
    orders: [
      { id: 'OID-0002', item: 'Suspension System', price: '₱2,500.00', status: 'Paid' },
    ],
  }
];

// Create the provider component
export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState(() => {
    const savedCustomers = localStorage.getItem('customers');
    return savedCustomers ? JSON.parse(savedCustomers) : defaultCustomers;
  });

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  // Function to add a new customer and ensure it updates the localStorage
  const addCustomer = (customer) => {
    const newCustomer = { ...customer, id: customers.length + 1 };
    setCustomers([...customers, newCustomer]);
  };

  const updateCustomer = (updatedCustomer) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  };

  const archiveCustomer = (customerId) => {
    setCustomers(customers.filter((customer) => customer.id !== customerId));
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, updateCustomer, archiveCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};
