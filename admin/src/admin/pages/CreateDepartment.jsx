import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/CreateDepartment.css";

const CreateDepartment = () => {
  const [form, setForm] = useState({
    name: "",
    code: "",
  });

  const [departments, setDepartments] = useState([]);
  const [editDept, setEditDept] = useState(null);

  // ================= FETCH =================
  const fetchDepartments = async () => {
    const res = await axios.get("http://localhost:5000/api/departments");
    setDepartments(res.data);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= EDIT =================
  const handleEdit = (dept) => {
    setEditDept(dept);
    setForm({
      name: dept.name,
      code: dept.code,
    });
  };

  // ================= CREATE / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editDept) {
      // UPDATE
      await axios.put(
        `http://localhost:5000/api/departments/${editDept._id}`,
        form
      );
    } else {
      // CREATE
      await axios.post("http://localhost:5000/api/departments", form);
    }

    // RESET
    setForm({ name: "", code: "" });
    setEditDept(null);
    fetchDepartments();
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/departments/${id}`);
    fetchDepartments();
  };

  return (
    <div className="dept-container">

      {/* HEADER */}
      <div className="dept-header">
        <h2>🏢 Department Management</h2>
        <p>Create & manage hospital departments</p>
        {/* BACK BUTTON */}
<button
  onClick={() => (window.location.hash = "/admin")}
  style={{
        background: "#0f172a",
    color: "white",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
  }}
>
  ⬅ Back to Dashboard
</button>
      </div>

      {/* EDIT INFO */}
      {editDept && (
        <p className="edit-text">
          Editing: {editDept.name}
        </p>
      )}

      {/* FORM */}
      <div className="dept-form-card">
        <form onSubmit={handleSubmit} className="dept-grid">

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Department Name"
            required
          />

          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Department Code"
            required
          />

          <button className="dept-btn">
            {editDept ? "✏️ Update Department" : "➕ Create Department"}
          </button>

        </form>
      </div>

      {/* LIST */}
      <div className="dept-list">

        {departments.map((d, index) => (
          <div className="dept-card" key={d._id || index}>

            <h3>{d.name}</h3>
            <p>Code: {d.code}</p>

            <div className="dept-actions">

              <button
                className="edit-btn"
                onClick={() => handleEdit(d)}
              >
                ✏️ Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(d._id)}
              >
                ❌ Delete
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default CreateDepartment;
