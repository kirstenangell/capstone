import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const SupplierContext = createContext();

// Create the provider component
export const SupplierProvider = ({ children }) => {
  const [suppliers, setSuppliers] = useState([]);

  // Fetch suppliers from the server on mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('http://localhost:5000/suppliers'); // API endpoint for fetching suppliers
        const data = await response.json();

        if (response.ok) {
          // Filter out archived suppliers before updating state
          const activeSuppliers = data.filter((supplier) => !supplier.archived);
          setSuppliers(activeSuppliers); // Update state with active suppliers only
        } else {
          console.error('Error fetching suppliers:', data.message); // Log server error message
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error); // Log client-side error
      }
    };

    fetchSuppliers(); // Call the fetch function when the component mounts
  }, []); // Empty dependency array ensures this runs only once

  // Function to add a new supplier
  const addSupplier = async (supplier) => {
    try {
      const response = await fetch('http://localhost:5000/add-supplier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplier), // Convert supplier object to JSON
      });

      if (response.ok) {
        const savedSupplier = await response.json();
        setSuppliers([...suppliers, savedSupplier]); // Add new supplier to the list
      } else {
        console.error('Failed to add supplier:', response.statusText); // Log if request fails
      }
    } catch (error) {
      console.error('Error adding supplier:', error); // Log client-side error
    }
  };

  // Function to update an existing supplier and sync with the backend
  const updateSupplier = async (updatedSupplier) => {
    try {
      const response = await fetch(`http://localhost:5000/update-supplier/${updatedSupplier.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSupplier), // Send updated supplier data
      });

      if (response.ok) {
        setSuppliers(
          suppliers.map((supplier) =>
            supplier.id === updatedSupplier.id ? updatedSupplier : supplier
          )
        ); // Update the state with the new supplier data
        console.log('Supplier updated successfully in backend and frontend');
      } else {
        console.error('Failed to update supplier:', response.statusText); // Log failure
      }
    } catch (error) {
      console.error('Error updating supplier:', error); // Log client-side error
    }
  };

  // Function to archive a supplier (soft delete) and remove it from the frontend
  const archiveSupplier = async (supplierId) => {
    try {
      const response = await fetch(`http://localhost:5000/archive-supplier/${supplierId}`, {
        method: 'PUT', // Use PUT method to archive the supplier
      });

      if (response.ok) {
        // Remove archived supplier from the current state
        setSuppliers(suppliers.filter((supplier) => supplier.id !== supplierId));
        console.log(`Supplier with ID ${supplierId} archived and removed from frontend.`);
      } else {
        console.error('Failed to archive supplier:', response.statusText); // Log failure
      }
    } catch (error) {
      console.error('Error archiving supplier:', error); // Log client-side error
    }
  };

  // Function to fetch product details from the database by product ID
  const fetchProductDetails = async (productId) => {
    if (!productId) {
      console.warn('fetchProductDetails called with undefined productId');
      return null; // Return null if no product ID is provided
    }

    try {
      const response = await fetch(`http://localhost:5000/products/${productId}`); // Fetch product details
      const data = await response.json();

      if (response.ok) {
        return data; // Return the product details
      } else {
        console.error('Error fetching product details:', data.message); // Log server error message
        return null; // Return null if server responds with an error
      }
    } catch (error) {
      console.error('Error fetching product details:', error); // Log client-side error
      return null; // Return null on network error
    }
  };

  return (
    <SupplierContext.Provider
      value={{
        suppliers, // Expose the list of suppliers to the rest of the application
        addSupplier, // Function to add a supplier
        updateSupplier, // Function to update supplier details
        archiveSupplier, // Function to archive a supplier
        fetchProductDetails, // Function to fetch product details
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
};
