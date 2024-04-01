import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { collection, addDoc, getDocs } from "firebase/firestore"; 
import { db } from '../../config/firestore';

const Add = ({ attendance, setattendance, setIsAdding, getattendance }) => {
  const [firstName, setFirstName] = useState('');
  const [asuid, setAsuid] = useState('');
  const [email, setEmail] = useState('');
  const [date] = useState(new Date().toLocaleString('en-US', { timeZone: 'America/Phoenix' }));
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [ipAddress, setIpAddress] = useState('');
  const [domainName, setDomainName] = useState('');

useEffect(() => {
  // Get the IP address
  fetch('https://api64.ipify.org?format=json')
    .then(response => response.json())
    .then(data => setIpAddress(data.ip))
    .catch(error => console.error('Error getting IP address:', error));

  // Get the domain name
  setDomainName(window.location.hostname);
}, []);


  useEffect(() => {
    const fetchAttendanceTimes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "attendance_times"));
        if (!querySnapshot.empty) {
          const { startTime, endTime } = querySnapshot.docs[0].data();
          setStartTime(startTime);
          setEndTime(endTime);
          console.log('Start Time:', startTime); // Log the start time
          console.log('End Time:', endTime); // Log the end time
        }
      } catch (error) {
        console.error('Error fetching attendance times: ', error);
      }
    };
    fetchAttendanceTimes();
  }, []);

  const handleAdd = async (e) => {
  e.preventDefault();
  
    // Check if attendance array is defined and find the existing entry
    const existingEntry = attendance && attendance.find(entry => entry.ipAddress === ipAddress);
    if (!existingEntry) {
      console.log('Found existing entry with IP address:', ipAddress);
    } else {
      console.log('No existing entry found with IP address:', ipAddress);
    }
    
        if (existingEntry) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'You have already made an entry.',
        showConfirmButton: true,
      });
    }
  if (!firstName || !asuid || !email || !date) {
    return Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: 'All fields are required.',
      showConfirmButton: true,
    });
  }

  if (!((startTime) || (endTime))) {
    return Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: `Data entry is allowed only between ${startTime} and ${endTime}.`,
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
    await addDoc(collection(db, "attendance"), newEmployee);
    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: `${firstName} - ${asuid}'s data has been Added.`,
      showConfirmButton: false,
      timer: 1500,
    });
    // Update the local state with the new entry
    setattendance([...attendance, newEmployee]);
  } catch (error) {
    console.log(error)
  }

  setFirstName('');
  setAsuid('');
  setEmail('');
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
          <input type="submit" value="Record My Attendance" />
        </div>
      </form>
    </div>
  );
};

export default Add;
