import React, { createContext, useState, useEffect } from 'react';

// Create the OrderContext
export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]); // State to hold all orders

  // Fetch orders from the database
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:5000/orders'); // Fetch from the /orders endpoint
      if (response.ok) {
        const fetchedOrders = await response.json(); // Parse JSON response
        setOrders(fetchedOrders); // Set orders in state
      } else {
        console.error('Failed to fetch orders:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Fetch orders when the component mounts
  useEffect(() => {
    fetchOrders();
  }, []);

  // Add order to the database and update local state
  const addOrder = async (order) => {
    try {
      const response = await fetch('http://localhost:5000/add-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order), // Send the new order data, including new address fields
      });

      if (response.ok) {
        const savedOrder = await response.json(); // Get the saved order
        setOrders((prevOrders) => [...prevOrders, savedOrder]); // Add the new order to the list
      } else {
        console.error('Failed to save order:', await response.text());
      }
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  // Update order in the database and update local state
  const updateOrder = async (updatedOrder) => {
    try {
      const response = await fetch(`http://localhost:5000/update-order/${updatedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder), // Send the updated order data, including new address fields
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
          )
        );
      } else {
        console.error('Failed to update order:', await response.text());
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // Archive order in the database and update local state
  const archiveOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/archive-order/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId) // Remove the archived order from the list
        );
      } else {
        console.error('Failed to archive order:', await response.text());
      }
    } catch (error) {
      console.error('Error archiving order:', error);
    }
  };

  // Return the context provider
  return (
    <OrderContext.Provider
      value={{
        orders, // Orders fetched from the database
        fetchOrders, // Function to fetch orders
        addOrder, // Function to add a new order
        updateOrder, // Function to update an existing order
        archiveOrder, // Function to archive an order
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
