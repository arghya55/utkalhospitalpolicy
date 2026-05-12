import React, { useState, useEffect } from "react";
import "./Addsop.css";
import { api } from "../api";

const AddSop = () => {

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
    status: "Active"
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

      const res = await api.post("/sops", {
        ...formData,
        department: user?.department,
      });

      setSuccess("✅ SOP Added Successfully!");

      // reset form
      setFormData({
        title: "",
        description: "",
        date: "",
        category: "IT",
        department: user?.department || "",
        status: "Active",
      });

      // 🔥 notify department page
      window.dispatchEvent(new Event("sop-added"));

   setTimeout(() => {
  window.location.hash = `#/department/${user?.department}`;
  
  setTimeout(() => {
    window.dispatchEvent(new Event("sop-added"));
  }, 200);
  
}, 500);

    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "❌ Failed to add sop");
    }
  };

  // ================= BACK =================
  const handleBack = () => {
    window.location.hash = `#/department/${user?.department}`;
  };

  // ================= UI =================
  return (
    <div className="add-sop-container">

      <button className="back-btn" onClick={handleBack}>
        ← Back
      </button>

      <div className="add-sop-header">
        <h1>Add New SOP</h1>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="add-sop-form-container">

        <form onSubmit={handleSubmit} className="add-sop-form">

          <div className="form-group">
            <label>SOP Title</label>
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
              ➕ Add sop
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default AddSop;