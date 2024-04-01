import React, { useState } from 'react';
import Swal from 'sweetalert2';

import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../../config/firestore';

const Add = ({ employees, setEmployees, setIsAdding, getEmployees }) => {
  const [firstName, setFirstName] = useState('');
  const [asuid, setAsuid] = useState('');
  const [email, setEmail] = useState('');
  const [ipAddress] = useState('192.168.1.1'); // Example IP address from the system
  const [domainName] = useState('example.com'); // Example domain name from the system
  const [date] = useState(new Date().toLocaleString('en-US', { timeZone: 'America/Phoenix' }));

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!firstName || !asuid || !email || !date) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }

    const newEmployee = {
      firstName,
      asuid,
      email,
      ipAddress,
      domainName,
      date,
    };

    try {
      await addDoc(collection(db, "attendance"), {
        ...newEmployee
      });
    } catch (error) {
      console.log(error)
    }

    setEmployees([...employees, newEmployee]);
    setIsAdding(false);
    getEmployees();

    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: `${firstName} ${asuid}'s data has been Added.`,
      showConfirmButton: false,
      timer: 1500,
    });
  };

  return (
    <div className="small-container">
      <form onSubmit={handleAdd}>
        <h1>Record Attendance</h1>
        <label htmlFor="firstName">Your Name</label>
        <input
          id="firstName"
          type="text"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label htmlFor="asuid">ASU ID</label>
        <input
          id="asuid"
          type="text"
          name="asuid"
          value={asuid}
          onChange={(e) => setAsuid(e.target.value)}
        />
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="ipAddress">IP Address</label>
        <input
          id="ipAddress"
          type="text"
          name="ipAddress"
          value={ipAddress}
          disabled
        />
        <label htmlFor="domainName">Domain Name</label>
        <input
          id="domainName"
          type="text"
          name="domainName"
          value={domainName}
          disabled
        />
        <label htmlFor="date">Date and Time (MST)</label>
        <input
          id="date"
          type="text"
          name="date"
          value={date}
          disabled
        />
        <div style={{ marginTop: '30px' }}>
          <input type="submit" value="Add" />
          <input
            style={{ marginLeft: '12px' }}
            className="muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsAdding(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Add;
