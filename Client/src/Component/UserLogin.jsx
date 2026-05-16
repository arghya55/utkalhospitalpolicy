import "./UserLogin.css";
import React, { useState } from "react";
import axios from "axios";

const UserLogin = () => {
  const [form, setForm] = useState({
    employeeId: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // reset old error

    try {
      const res = await axios.post(
        "https://utkalpolicybackend.onrender.com/api/users/login",
        form
      );

      if (res.data.token) {
        sessionStorage.setItem("user", JSON.stringify(res.data.user));
        sessionStorage.setItem("token", res.data.token);

        window.location.hash = "#/policy";
      } else {
        setError("Invalid login response");
      }

    } catch (err) {
  const status = err.response?.status;
  const msg = err.response?.data?.message;

  if (status === 401 || status === 400) {
    setError("❌ Wrong username or password");
  } 
  else if (msg) {
    setError(`❌ ${msg}`);
  } 
  else {
    setError("❌ Network / Server error. Try again later");
  }
}
  };

  return (
    <div className="login-container">
      
      <form onSubmit={handleLogin} className="login-box">
            {/* 🔥 ERROR MESSAGE */}
        {error && <div className="error-box">{error}</div>}

        <button
          type="button"
          className="user-homeback-btn"
          onClick={() => (window.location.hash = "#/home")}
        >
          Back Home
        </button>

        <h2>USER LOGIN</h2>

        <input
          placeholder="Employee ID"
          onChange={(e) =>
            setForm({ ...form, employeeId: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button type="submit">Login</button>

    

      </form>
    </div>
  );
};

export default UserLogin;