// src/context/CustomerContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const CustomerContext = createContext();

// Create the provider component
export const CustomerProvider = ({ children }) => {
  // Initialize customers from localStorage or start with default data
  const [customers, setCustomers] = useState(() => {
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      return JSON.parse(savedCustomers);
    } else {
      // Default customers (optional)
      return [
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
          newAddress: {},
          orderID: "OID-0000",
          orderDetails: "Electrical System",
          orderPrice: "₱1,000.00",
          orders: [
            { id: 'OID-0000', item: 'Electrical System', price: '₱1,000.00', status: 'Paid' },
            { id: 'OID-0001', item: 'HVAC System', price: '₱5,000.00', status: 'Pending' },
          ],
        },
        // Add more initial customers as needed
      ];
    }
  });

  // Persist customers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  // Function to generate a unique Customer ID
  const generateCustomerID = () => {
    const nextId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    return nextId;
  };

  // Function to add a new customer
  const addCustomer = (customer) => {
    const newCustomer = { ...customer, id: generateCustomerID() };
    setCustomers([...customers, newCustomer]);
  };

  // Function to update an existing customer
  const updateCustomer = (updatedCustomer) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
  };

  // Function to archive (remove) a customer
  const archiveCustomer = (customerId) => {
    setCustomers(customers.filter((customer) => customer.id !== customerId));
  };

  return (
    <CustomerContext.Provider value={{ customers, addCustomer, updateCustomer, archiveCustomer }}>
      {children}
    </CustomerContext.Provider>
  );
};
