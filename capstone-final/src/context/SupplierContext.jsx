// src/context/SupplierContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const SupplierContext = createContext();

// Create the provider component
export const SupplierProvider = ({ children }) => {
  // Initialize suppliers from localStorage or start with default data
  const [suppliers, setSuppliers] = useState(() => {
    const savedSuppliers = localStorage.getItem('suppliers');
    if (savedSuppliers) {
      return JSON.parse(savedSuppliers);
    } else {
      // Default suppliers (optional)
      return [
        {
          id: 1,
          oid: 'OID0000', // Starts with '0'
          name: 'ABC Electronics',
          type: 'Wholesale',
          source: 'Manual Add',
          phone: '+63 123 456 7890',
          email: 'contact@abcelectronics.com',
          status: 'Active',
          currentAddress: {
            street: '5678 Oak Avenue',
            city: 'Makati City',
            province: 'Metro Manila',
            zipCode: '1200',
            landmark: 'Near Ayala Center',
          },
          newAddress: {},
          supplyID: 'SID-0000',
          supplyDetails: 'Electronics Components',
          supplyPrice: '₱50,000.00',
          supplies: [
            { id: 'SID-0000', item: 'Resistors', price: '₱500.00', status: 'Delivered' },
            { id: 'SID-0001', item: 'Capacitors', price: '₱1,500.00', status: 'Pending' },
          ],
        },
        // Add more initial suppliers as needed
      ];
    }
  });

  // Persist suppliers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  // Function to generate a unique Supplier ID
  const generateSupplierID = () => {
    const nextId = suppliers.length > 0 ? Math.max(...suppliers.map(s => s.id)) + 1 : 1;
    return nextId;
  };

  // Function to add a new supplier
  const addSupplier = (supplier) => {
    const newOID = generateNextOID(suppliers);
    const newId = Date.now(); // Simple unique identifier; consider using UUID for more robustness
    const newSupplier = { ...supplier, oid: newOID, id: newId };
    setSuppliers([...suppliers, newSupplier]);
  };

  // Function to update an existing supplier
  const updateSupplier = (updatedSupplier) => {
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === updatedSupplier.id ? updatedSupplier : supplier
      )
    );
  };

  // Function to archive (remove) a supplier
  const archiveSupplier = (supplierId) => {
    setSuppliers(suppliers.filter((supplier) => supplier.id !== supplierId));
  };

  // Utility function to generate the next OID
  const generateNextOID = (suppliers) => {
    if (suppliers.length === 0) return 'OID0000';

    // Extract numeric parts of OIDs and find the maximum
    const numericOIDs = suppliers.map(supplier => {
      const match = supplier.oid.match(/^OID(\d{4,})$/);
      return match ? parseInt(match[1], 10) : 0;
    });

    const maxOID = Math.max(...numericOIDs);
    const nextOIDNumber = maxOID + 1;
    const paddedNumber = String(nextOIDNumber).padStart(4, '0'); // Ensures at least 4 digits
    return `OID${paddedNumber}`;
  };

  return (
    <SupplierContext.Provider value={{ suppliers, addSupplier, updateSupplier, archiveSupplier }}>
      {children}
    </SupplierContext.Provider>
  );
};
