
import "./UserLogin.css";

import React, { useState } from "react";
import axios from "axios";

const UserLogin = () => {
  const [form, setForm] = useState({
    employeeId: "",
    password: "",
  });

 const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(
      "https://utkalpolicybackend.onrender.com/api/users/login",
      form
    );



    if (res.data.token) {
     sessionStorage.setItem("user", JSON.stringify(res.data.user));
sessionStorage.setItem("token", res.data.token);

      console.log("TOKEN SAVED:", res.data.token);
          console.log("LOGIN RESPONSE:", res.data);

      window.location.hash = "#/policy";
    } else {
      alert("No token received");
    }

  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};
  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-box">

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
<button
  type='button'
  className="user-logout-btn"
  onClick={() => {
    window.location.hash = "#/home";
  }}
>
  back Home
</button>

      </form>
    </div>
  );
};

export default UserLogin;