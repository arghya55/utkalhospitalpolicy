import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CreateUsers.css";

const CreateUsers = () => {
  const [form, setForm] = useState({
    name: "",
    employeeId: "",
    password: "",
    department: "",
    canAddPolicy: false, // 🔥 MUST BE HERE
  });

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [editUser, setEditUser] = useState(null);

  // ================= FETCH =================
  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/users");
    setUsers(res.data);
  };

  const fetchDepartments = async () => {
    const res = await axios.get("http://localhost:5000/api/departments");
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= EDIT =================
  const handleEdit = (user) => {
    setEditUser(user);

    setForm({
      name: user.name,
      employeeId: user.employeeId,
      password: "",
      department: user.department?._id || "",
      canAddPolicy: user.canAddPolicy || false, // 🔥 IMPORTANT FIX
    });
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editUser) {
  const updatedData = { ...form };

  // password empty হলে পাঠাবো না
  if (!form.password) {
    delete updatedData.password;
  }

  await axios.put(
    `http://localhost:5000/api/users/${editUser._id}`,
    updatedData
  );
} else {
  await axios.post("http://localhost:5000/api/users", form);
}
    setForm({
      name: "",
      employeeId: "",
      password: "",
      department: "",
      canAddPolicy: false, // 🔥 RESET FIX
    });

    setEditUser(null);
    fetchUsers();
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/users/${id}`);
    fetchUsers();
  };

const handlePasswordUpdate = async (user) => {
  const newPassword = prompt("Enter new password");

  if (!newPassword) return;

  try {
    await axios.put(
      `http://localhost:5000/api/users/${user._id}`,
      { password: newPassword }
    );

    alert("✅ Password updated successfully");
  } catch (err) {
    console.log(err);
    alert("❌ Failed to update password");
  }
};

  return (
    <div className="user-container">

      <div className="header">
        <h2>👤 User Management</h2>
        <button onClick={() => (window.location.hash = "#/admin")} className="back-home">
          Back
        </button>
      </div>

      {/* FORM */}
      <div className="form-card">
        <form onSubmit={handleSubmit} className="grid">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />

          <input
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            placeholder="Employee ID"
            required
          />

          {editUser ? (
  <input
    type="password"
    name="password"
    value={form.password}
    onChange={handleChange}
    placeholder="New Password (optional)"
  />
) : (
  <input
    type="password"
    name="password"
    value={form.password}
    onChange={handleChange}
    placeholder="Password"
    required
  />
)}

          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* 🔥 CHECKBOX (IMPORTANT POSITION FIXED) */}
          <label style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={form.canAddPolicy}
              onChange={(e) =>
                setForm({ ...form, canAddPolicy: e.target.checked })
              }
            />
            Can Add Policy
          </label>

          <button className="primary-btn">
            {editUser ? "✏️ Update User" : "➕ Create User"}
          </button>

        </form>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Department</th>
              <th>Permission</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.employeeId}</td>
                <td>{u.department?.name}</td>
                <td>{u.canAddPolicy ? "YES" : "NO"}</td>

                <td>
                  <button className="edit-btn" onClick={() => handleEdit(u)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(u._id)}>Delete</button>
                   <button className="password-btn" onClick={() => handlePasswordUpdate(u)}>
  🔐 Password
</button>
                  
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default CreateUsers;
