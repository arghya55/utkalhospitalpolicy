import React, { useEffect, useState } from "react";
// import axios from "axios";
import { api } from "../api";
import logo from "../assets/utkal-logo.png";
import "./Policy.css";

const Policy = () => {
  const [departments, setDepartments] = useState([]);
    const [user, setUser] = useState(null); 

      // ================= FETCH USER =================
  useEffect(() => {
  const storedUser = JSON.parse(sessionStorage.getItem("user")); // ✅ FIX
  setUser(storedUser);
}, []);

  

  // ================= FETCH DEPARTMENTS =================
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/departments");
        setDepartments(res.data);
      } catch (err) {
        console.log("Department fetch error:", err.response?.data || err.message);
      }
    };

    fetchDepartments();
  }, []);

  return (
    <div className="policy-container">

      {/* BACK BUTTON */}
      <button
        className="back-home-btn"
        onClick={() => (window.location.hash = "#/home")}
      >
        ← Home
      </button>

      <div className="user-info">
 <h3>
  Welcome To Utkal SOP / Policies
</h3>
</div>
 <h1> {user?.name ? `  ${user.name}` : ""}</h1>

      <h1><b>Please Select Your Department</b></h1>

      {/* 🔥 IMPORTANT WRAPPER */}
      <div className="department-buttons">

        {departments.map((d) => (
          <button
            key={d._id}
            className="department-btn"
            onClick={() =>
              window.location.hash = `#/department/${d._id}`
            }
          >
            {d.name}
          </button>
        ))}

      </div>

    </div>
  );
};

export default Policy;