// src/context/CustomerContext.js
import React, { createContext, useState } from 'react';

// Create the context
export const CustomerContext = createContext();

// Create the provider component
export const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: "Juan Dela Cruz",
      type: "Individual",
      source: "Manual Add",
      phone: "+63 000 000 0000",
      email: "juandelacruz@gmail.com",
      status: "Active",
      address: "Street Number, Street Name, State, Zip Code",
      orderID: "OID-0000",
      orderDetails: "Electrical System",
      orderPrice: "₱1,000.00",
      orders: [
        { id: 'OID-0000', item: 'Electrical System', price: '₱1,000.00', status: 'Paid' },
        { id: 'OID-0001', item: 'HVAC System', price: '₱5,000.00', status: 'Pending' },
      ],
    },
    // Add more initial customers as needed
  ]);

  // Function to add a new customer
  const addCustomer = (customer) => {
    setCustomers((prevCustomers) => {
      const maxId = prevCustomers.reduce(
        (max, customer) => Math.max(max, customer.id),
        0
      );
      return [...prevCustomers, { ...customer, id: maxId + 1 }];
    });
  };

  // Function to update an existing customer
  const updateCustomer = (updatedCustomer) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  };

  // Function to archive (remove) a customer
  const archiveCustomer = (customerId) => {
    setCustomers((prevCustomers) =>
      prevCustomers.filter((customer) => customer.id !== customerId)
    );
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, updateCustomer, archiveCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};
