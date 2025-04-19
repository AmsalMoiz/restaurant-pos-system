import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Employees.css";

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:3001' : `http://${window.location.hostname}:3001`;

function EmployeesPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editedEmployeeData, setEditedEmployeeData] = useState({});
  const [newEmployee, setNewEmployee] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const addRowRef = useRef(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch(`${API_URL}/dashboard/users`);
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error("Error fetching employee data:", err);
      }
    };
    fetchEmployees();
  }, []);

  const handleUpdateEmployee = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/dashboard/users/update/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedEmployeeData),
      });
      if (!response.ok) throw new Error("Update failed");
      setEmployees((prev) => prev.map((emp) => emp.user_id === userId ? { ...emp, ...editedEmployeeData } : emp));
      setEditingEmployeeId(null);
      setEditedEmployeeData({});
    } catch (err) {
      alert("Failed to update employee.");
    }
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.password || !newEmployee.role || !newEmployee.hourly_pay_rate) {
      alert("All fields must be filled out.");
      return;
    }
    setShowConfirmPopup(true);
  };

  const confirmAddEmployee = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/users/insert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEmployee),
      });
      if (!response.ok) throw new Error("Add failed");
      const added = await response.json();
      setEmployees((prev) => [...prev, added]);
      setNewEmployee(null);
      setShowConfirmPopup(false);
    } catch (err) {
      alert("Failed to add employee.");
    }
  };

  const handleDeleteEmployee = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/dashboard/users/delete/${userId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Delete failed");
      setEmployees((prev) => prev.filter((emp) => emp.user_id !== userId));
      setEmployeeToDelete(null);
    } catch (err) {
      alert("Failed to delete employee.");
    }
  };

  return (
    <div className="admin-dashboard-body">
      <div className="admin-dashboard">
        <header className="admin-header">
          <h1>Employee Management</h1>
          <div className="admin-info">
            <button className="edit-btn" onClick={() => setEditMode(!editMode)}>{editMode ? "Done" : "Edit"}</button>
            <button className="back-btn" onClick={() => navigate(-1)}>Back to Dashboard</button>
          </div>
        </header>
        <main className="admin-content">
          <div className="admin-section">
            {editMode && (
              <div className="add-item-button-wrapper">
                <button className="add-item-btn" onClick={() => {
                  setNewEmployee({ name: "", email: "", password: "", role: "", hourly_pay_rate: "" });
                  setTimeout(() => addRowRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}>
                  + Add New Employee
                </button>
              </div>
            )}
            <div className="employees-container">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Hourly Rate</th>
                    <th>Email</th>
                    {editMode && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, index) => (
                    <tr key={index}>
                      {editingEmployeeId === emp.user_id ? (
                        <>
                          <td><input value={editedEmployeeData.name || ''} onChange={(e) => setEditedEmployeeData({ ...editedEmployeeData, name: e.target.value })} /></td>
                          <td><input value={editedEmployeeData.role || ''} onChange={(e) => setEditedEmployeeData({ ...editedEmployeeData, role: e.target.value })} /></td>
                          <td><input type="number" value={editedEmployeeData.hourly_pay_rate || ''} onChange={(e) => setEditedEmployeeData({ ...editedEmployeeData, hourly_pay_rate: e.target.value })} /></td>
                          <td>{emp.email}</td>
                          <td>
                            <button onClick={() => setEditingEmployeeId(null)}>Cancel</button>
                            <button onClick={() => handleUpdateEmployee(emp.user_id)}>Save</button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{emp.name}</td>
                          <td>{emp.role}</td>
                          <td>${emp.pay?.toFixed(2)}</td>
                          <td>{emp.email}</td>
                          {editMode && (
                            <td style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <button className="delete-btn" onClick={() => setEmployeeToDelete(emp)}><span className="minus-line"></span></button>
                              <button onClick={() => {
                                setEditingEmployeeId(emp.user_id);
                                setEditedEmployeeData(emp);
                              }}>Update</button>
                            </td>
                          )}
                        </>
                      )}
                    </tr>
                  ))}
                  {editMode && newEmployee && (
                    <tr ref={addRowRef} id="add-employee-row">
                      <td><input placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} /></td>
                      <td><input placeholder="Role" value={newEmployee.role} onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })} /></td>
                      <td><input type="number" placeholder="Hourly Rate" value={newEmployee.hourly_pay_rate} onChange={(e) => setNewEmployee({ ...newEmployee, hourly_pay_rate: e.target.value })} /></td>
                      <td><input placeholder="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} /></td>
                      <td>
                        <input type="password" placeholder="Password" value={newEmployee.password} onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })} />
                        <button onClick={() => setNewEmployee(null)}>Cancel</button>
                        <button onClick={handleAddEmployee}>Submit</button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {showConfirmPopup && (
          <>
            <div className="modal-overlay" onClick={() => setShowConfirmPopup(false)} />
            <div className="confirmation-box">
              <h3>Confirm New Employee</h3>
              <p><strong>Name:</strong> {newEmployee.name}</p>
              <p><strong>Email:</strong> {newEmployee.email}</p>
              <p><strong>Role:</strong> {newEmployee.role}</p>
              <p><strong>Hourly Rate:</strong> ${newEmployee.hourly_pay_rate}</p>
              <div className="confirm-buttons">
                <button onClick={() => setShowConfirmPopup(false)}>Cancel</button>
                <button onClick={confirmAddEmployee}>Confirm</button>
              </div>
            </div>
          </>
        )}

        {employeeToDelete && (
          <>
            <div className="modal-overlay" onClick={() => setEmployeeToDelete(null)} />
            <div className="confirmation-box">
              <h3>Confirm Delete</h3>
              <p><strong>Name:</strong> {employeeToDelete.name}</p>
              <p><strong>Email:</strong> {employeeToDelete.email}</p>
              <p><strong>Role:</strong> {employeeToDelete.role}</p>
              <div className="confirm-buttons">
                <button onClick={() => setEmployeeToDelete(null)}>Cancel</button>
                <button onClick={() => handleDeleteEmployee(employeeToDelete.user_id)}>Delete</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EmployeesPage;
