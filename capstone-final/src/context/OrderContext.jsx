import React, { createContext, useState, useEffect } from 'react';

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from the database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/orders');
        if (response.ok) {
          const fetchedOrders = await response.json();
          setOrders(fetchedOrders);
        } else {
          console.error('Failed to fetch orders:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Add order to the database and update local state
  const addOrder = async (order) => {
    try {
      const response = await fetch('http://localhost:5000/add-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        const savedOrder = await response.json();
        setOrders((prevOrders) => [...prevOrders, savedOrder]);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedOrder),
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

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
