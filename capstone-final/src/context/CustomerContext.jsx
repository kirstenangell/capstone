import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const CustomerContext = createContext();

// Default customers (for initial data)
const defaultCustomers = [
  {
    id: 1,
    first_name: "Juan",
    last_name: "Dela Cruz",
    type: "Individual",
    source: "Manual Add",
    phone: "+63 000 000 0000",
    email: "juandelacruz@gmail.com",
    status: "Active",
    currentAddress: {
      street: "1234 Elm Street",
      barangay: "Barangay 1",
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
    first_name: "Maria",
    last_name: "Santos",
    type: "Individual",
    source: "Online Registration",
    phone: "+63 987 654 3210",
    email: "mariasantos@gmail.com",
    status: "Inactive",
    currentAddress: {
      street: "5678 Maple Avenue",
      barangay: "Barangay 2",
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
  const [customers, setCustomers] = useState(defaultCustomers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch non-archived customers from the backend
  const fetchCustomers = () => {
    setLoading(true);
    fetch('http://localhost:5000/customers') // Endpoint for fetching non-archived customers
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched customers from the backend:', data); // Debug log to ensure correct data
        const formattedCustomers = data
          .filter(customer => !customer.archived) // Exclude archived customers
          .map(customer => ({
            id: customer.id,
            first_name: customer.first_name,
            last_name: customer.last_name,
            type: customer.type,
            email: customer.email,
            phone: customer.phone,
            paymentStatus: customer.payment_status,
            paymentReference: customer.payment_reference,
            status: customer.status, // Add status field if present
            currentAddress: {
              street: customer.current_street,
              barangay: customer.current_barangay,
              city: customer.current_city,
              province: customer.current_province,
              zipCode: customer.current_zip,
              landmark: customer.current_landmark,
            },
            newAddress: {
              street: customer.new_street,
              barangay: customer.new_barangay,
              city: customer.new_city,
              province: customer.new_province,
              zipCode: customer.new_zip,
              landmark: customer.new_landmark,
            },
            orders: customer.orders || [], // Include orders if they're fetched
          }));

        setCustomers(formattedCustomers); // Update customers with formatted data
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
        setError('Failed to fetch customers');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomers(); // Fetch customers when provider mounts
  }, []);

  // Add new customer
  const addCustomer = (customerData) => {
    const payload = {
      first_name: customerData.first_name || '',
      last_name: customerData.last_name || '',
      type: customerData.type || '',
      email: customerData.email || '',
      phone: customerData.phone || '',
      payment_status: customerData.paymentStatus || '',
      payment_reference: customerData.paymentReference || '',
      current_street: customerData.currentAddress?.street || '',
      current_barangay: customerData.currentAddress?.barangay || '',
      current_city: customerData.currentAddress?.city || '',
      current_province: customerData.currentAddress?.province || '',
      current_zip: customerData.currentAddress?.zipCode || '',
      current_landmark: customerData.currentAddress?.landmark || '',
      new_street: customerData.newAddress?.street || '',
      new_barangay: customerData.newAddress?.barangay || '',
      new_city: customerData.newAddress?.city || '',
      new_province: customerData.newAddress?.province || '',
      new_zip: customerData.newAddress?.zipCode || '',
      new_landmark: customerData.newAddress?.landmark || '',
    };

    console.log("Payload being sent to the server:", payload); // Debug log to verify payload

    return fetch('http://localhost:5000/add-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to add customer');
        }
        return response.json();
      })
      .then((data) => {
        if (data.message === 'Customer added successfully') {
          setCustomers((prevCustomers) => [
            ...prevCustomers,
            { ...payload, id: data.id },
          ]);
          console.log("Customer added successfully:", data);
        }
      })
      .catch((error) => {
        console.error('Error adding customer:', error);
      });
  };

  // Update existing customer
  const updateCustomer = (updatedCustomer) => {
    const payload = {
      first_name: updatedCustomer.first_name,
      last_name: updatedCustomer.last_name,
      type: updatedCustomer.type,
      email: updatedCustomer.email,
      phone: updatedCustomer.phone,
      payment_status: updatedCustomer.paymentStatus || '',
      payment_reference: updatedCustomer.paymentReference || '',
      current_street: updatedCustomer.currentAddress?.street || '',
      current_barangay: updatedCustomer.currentAddress?.barangay || '',
      current_city: updatedCustomer.currentAddress?.city || '',
      current_province: updatedCustomer.currentAddress?.province || '',
      current_zip: updatedCustomer.currentAddress?.zipCode || '',
      current_landmark: updatedCustomer.currentAddress?.landmark || '',
    };

    return fetch(`http://localhost:5000/update-customer/${updatedCustomer.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to update customer with status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.message === 'Customer updated successfully') {
          setCustomers(prevCustomers =>
            prevCustomers.map(customer =>
              customer.id === updatedCustomer.id ? { ...payload, id: updatedCustomer.id } : customer
            )
          );
        }
      })
      .catch(error => {
        console.error('Error updating customer:', error);
      });
  };

  // Archive customer
  const archiveCustomer = (customerId) => {
    fetch(`http://localhost:5000/archive-customer/${customerId}`, {
      method: 'PUT',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to archive customer');
        }
        return response.json();
      })
      .then(data => {
        console.log(data.message); // Archive success message
        setCustomers(prevCustomers =>
          prevCustomers.filter(customer => customer.id !== customerId) // Remove from frontend view
        );
      })
      .catch(error => {
        console.error('Error archiving customer:', error);
      });
  };

  return (
    <CustomerContext.Provider value={{
      customers,
      addCustomer,
      updateCustomer,
      archiveCustomer,
      fetchCustomers,
      loading,
      error,
    }}>
      {children}
    </CustomerContext.Provider>
  );
};
