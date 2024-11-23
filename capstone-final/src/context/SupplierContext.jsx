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
        const response = await fetch('http://localhost:5000/suppliers');
        const data = await response.json();
        if (response.ok) {
          const groupedData = data.reduce((acc, row) => {
            const supplierIndex = acc.findIndex((s) => s.id === row.id);
            if (supplierIndex === -1) {
              acc.push({
                ...row,
                productLists: row.product_name ? [{ ...row }] : [],
              });
            } else {
              acc[supplierIndex].productLists.push({ ...row });
            }
            return acc;
          }, []);
          setSuppliers(groupedData);
        } else {
          console.error('Error fetching suppliers:', data.message);
        }
      } catch (error) {
        console.error('Error fetching suppliers:', error);
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
        body: JSON.stringify(supplier),
      });
  
      if (response.ok) {
        const savedSupplier = await response.json();
        // Update the suppliers state with the new supplier
        setSuppliers((prevSuppliers) => [...prevSuppliers, savedSupplier]);
      } else {
        console.error('Failed to add supplier:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding supplier:', error);
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
