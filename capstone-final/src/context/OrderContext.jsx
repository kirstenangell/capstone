// src/context/OrderContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Create the OrderContext
export const OrderContext = createContext();

// Utility function to generate the next OID
const generateNextOID = (orders) => {
  if (orders.length === 0) return 'OID0000';

  // Extract numeric parts of OIDs and find the maximum
  const numericOIDs = orders.map(order => {
    const match = order.oid.match(/^OID(\d{4,})$/);
    return match ? parseInt(match[1], 10) : 0;
  });

  const maxOID = Math.max(...numericOIDs);
  const nextOIDNumber = maxOID + 1;
  const paddedNumber = String(nextOIDNumber).padStart(4, '0'); // Ensures at least 4 digits
  return `OID${paddedNumber}`;
};

// OrderProvider component to wrap around parts of the app that need access to orders
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const savedOrders = localStorage.getItem('orders');
    return savedOrders ? JSON.parse(savedOrders) : [
      // Example initial order
      {
        id: 1,
        oid: 'OID0000', // Starts with '0'
        title: 'Sample Order Title',
        customer: 'John Doe',
        address: '123 Main St, Springfield',
        price: 'PHP80,000.00',
        status: 'DELIVERY',
        date: 'May 21, 2024',
        deliveryOption: 'Pick Up',
        pickUpDate: 'May 25, 2024',
        pickUpTime: '2:00 PM',
        paymentOption: 'GCASH',
        products: ['Sample Product 1', 'Sample Product 2'],
      },
      // Add more initial orders as needed
    ];
  });

  // Persist orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  // Function to add a new order with sequential OID
  const addOrder = (order) => {
    const newOID = generateNextOID(orders);
    const newOrder = { ...order, oid: newOID };
    setOrders([...orders, newOrder]);
  };

  // Function to update an existing order
  const updateOrder = (updatedOrder) => {
    setOrders(
      orders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
    );
  };

  // Function to archive an order
  const archiveOrder = (orderId) => {
    setOrders(orders.filter((order) => order.id !== orderId));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder, archiveOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
