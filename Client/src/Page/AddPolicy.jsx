import React, { useState, useEffect } from "react";
import "./AddPolicy.css";
import { api } from "../api";

const AddPolicy = () => {

  // ✅ FIXED USER STATE
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  // ================= STATE =================
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    category: "IT",
    department: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ FIXED (NO LOOP)
  useEffect(() => {
    if (user && !formData.department) {
      setFormData((prev) => ({
        ...prev,
        department: user.department,
      }));
    }
  }, [user]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      const res = await api.post("/policies", {
        ...formData,
        department: user?.department,
      });

      setSuccess("✅ Policy Added Successfully!");

      // reset form
      setFormData({
        title: "",
        description: "",
        date: "",
        category: "IT",
        department: user?.department || "",
      });

      // 🔥 notify department page
      window.dispatchEvent(new Event("policy-added"));

   setTimeout(() => {
  window.location.hash = `#/department/${user?.department}`;
  
  setTimeout(() => {
    window.dispatchEvent(new Event("policy-added"));
  }, 200);
  
}, 500);

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "❌ Failed to add policy");
    }
  };

  // ================= BACK =================
  const handleBack = () => {
    window.location.hash = `#/department/${user?.department}`;
  };

  // ================= UI =================
  return (
    <div className="add-policy-container">

      <button className="back-btn" onClick={handleBack}>
        ← Back
      </button>

      <div className="add-policy-header">
        <h1>Add New Policy</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="add-policy-form-container">

        <form onSubmit={handleSubmit} className="add-policy-form">

          <div className="form-group">
            <label>Policy Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
          </div>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={handleBack}
            >
              Cancel
            </button>

            <button type="submit" className="submit-btn">
              ➕ Add Policy
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default AddPolicy;