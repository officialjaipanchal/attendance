import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { collection, getDocs, setDoc } from "firebase/firestore"; 
import { db } from '../../config/firestore';
import Swal from 'sweetalert2';

const Header = ({ setIsAdding, setIsAuthenticated, employees, setEmployees }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const exportToExcel = () => {
    const header = ['Id', 'Student Name', 'Email', 'Date-Time', 'Start Time', 'End Time', 'IP Address', 'Domain Name'];
    const data = employees.map((employee) => {
      return [
        employee.id,
        employee.firstName,
        employee.email,
        employee.date,
        employee.startTime,
        employee.endTime,
        employee.ipAddress,
        employee.domainName,
      ];
    });

    const ws = XLSX.utils.aoa_to_sheet([header, ...data]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Data');

    XLSX.writeFile(wb, 'attendance_data.xlsx');
  };

  const handleUpdate = async () => {
    try {
      // Fetch the existing document from Firestore
      const querySnapshot = await getDocs(collection(db, "attendance_times"));
      const doc = querySnapshot.docs[0]; // Assuming there's only one document in the collection
  
      if (!doc.exists()) {
        console.error("No attendance times document found");
        return;
      }
  
      const existingTimes = doc.data();
      const updatedTimes = {
        startTime: startTime || existingTimes.startTime,
        endTime: endTime || existingTimes.endTime,
        date: new Date().toISOString().split('T')[0], // Add the current date to the data
      };
  
      // Update the document with the updated times
      await setDoc(doc.ref, updatedTimes);
  
      // Update the startTime and endTime for all employees
      const updatedEmployees = employees.map((employee) => {
        return {
          ...employee,
          startTime: updatedTimes.startTime,
          endTime: updatedTimes.endTime,
        };
      });
      setEmployees(updatedEmployees);
  
      // Reset the start time and end time inputs
      setStartTime('');
      setEndTime('');
  
      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `Start time and end time have been updated.`,
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error('Error updating times: ', error);
    }
  };

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

  return (
    <header>
      <h1>Attendance Management</h1>
      <div style={{ marginTop: '30px', marginBottom: '18px' }}>
        <button onClick={exportToExcel}>Export to Excel</button>
        <div>
          <label htmlFor="startTime">Start Time:</label>
          <input
            id="startTime"
            type="text"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="endTime">End Time:</label>
          <input
            id="endTime"
            type="text"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
        <button onClick={handleUpdate}>Update Times</button>
      </div>
    </header>
  );
};

export default Header;
