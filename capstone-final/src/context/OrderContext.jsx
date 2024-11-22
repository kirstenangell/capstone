import React, { createContext, useState, useEffect } from 'react';

// Create the OrderContext
export const OrderContext = createContext();

// OrderProvider component to wrap around parts of the app that need access to orders
export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from the backend when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders from the backend.');
        }

        const data = await response.json();
        setOrders(data); // Set fetched orders to state
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Failed to load orders. Please try again.');
      }
    };

    fetchOrders();
  }, []);

  // Function to add a new order
  const addOrder = async (order) => {
    console.log('Saving order to backend:', order);

    try {
      const response = await fetch('http://localhost:5000/add-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Failed to save order to the database.');
      }

      const result = await response.json();
      console.log('Order saved to backend:', result);

      // Add the new order to the frontend state
      setOrders((prevOrders) => [...prevOrders, result]);

      alert('Order saved successfully!');
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order. Please try again.');
    }
  };

  // Function to update an existing order
  const updateOrder = async (updatedOrder) => {
    console.log('Updating order in backend:', updatedOrder);

    try {
      const response = await fetch(`http://localhost:5000/update-order/${updatedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
      });

      if (!response.ok) {
        throw new Error('Failed to update order in the database.');
      }

      const result = await response.json();
      console.log('Order updated in backend:', result);

      // Update the order in the frontend state
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
      );

      alert('Order updated successfully!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order. Please try again.');
    }
  };

  // Function to archive an order based on its ID
  const archiveOrder = async (orderId) => {
    console.log('Archiving order with ID:', orderId);

    try {
      const response = await fetch(`http://localhost:5000/archive-order/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to archive order in the database.');
      }

      const result = await response.json();
      console.log('Order archived in backend:', result);

      // Remove the archived order from the frontend state
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));

      alert('Order archived successfully!');
    } catch (error) {
      console.error('Error archiving order:', error);
      alert('Failed to archive order. Please try again.');
    }
  };

  // Function to fetch a specific order by ID (optional utility)
  const getOrderById = (id) => {
    return orders.find((order) => order.id === id);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrder,
        archiveOrder,
        getOrderById, // Optional utility for fetching a specific order
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
