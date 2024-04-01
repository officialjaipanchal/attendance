import React from 'react';

const Table = ({ employees, handleEdit, handleDelete }) => {
  return (
    <div className="contain-table">
      <table className="striped-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Student Name</th>
            <th>Email</th>
            <th>Date-Time</th>
            <th>IP Address</th>
            <th>Domain Name</th>
            {/* <th colSpan={2} className="text-center">
              Actions
            </th> */}
          </tr>
        </thead>
        <tbody>
          {employees ? (
            employees.map((employee, i) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.firstName}</td>
                <td>{employee.email}</td>
                <td>{employee.date}</td>
                <td>{employee.ipAddress}</td>
                <td>{employee.domainName}</td>
                {/* <td className="text-right">
                  <button
                    onClick={() => handleEdit(employee.id)}
                    className="button muted-button"
                  >
                    Edit
                  </button>
                </td> */}
                {/* <td className="text-left">
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="button muted-button"
                  >
                    Delete
                  </button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9}></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
