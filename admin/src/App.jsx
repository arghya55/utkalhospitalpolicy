import React, { useEffect, useState } from "react";

import Dashboard from "./admin/pages/Dashboard";
import CreateDepartment from "./admin/pages/CreateDepartment";
import CreateUsers from "./admin/pages/CreateUsers";
import AdminLogin from "./admin/pages/AdminLogin";
// import UserLogin from "./admin/Component/UserLogin";

import axios from "axios";
axios.defaults.baseURL =
  "https://utkalpolicybackend.onrender.com/api";

// ================= AXIOS INTERCEPTOR =================
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

function App() {
  const [page, setPage] = useState("AdminLogin");

  // ================= ROUTE HANDLER =================
  const handleRoute = () => {
    let route = window.location.hash;

    route = route
      .replace("#", "")
      .toLowerCase()
      .replace(/\/$/, "") || "/";

    switch (route) {
      case "/admin":
        setPage("admin");
        break;

      case "/admin/create-department":
        setPage("createDepartment");
        break;

      case "/admin/create-users":
        setPage("createUsers");
        break;

      case "/admin/login":
        setPage("AdminLogin");
        break;

      // case "/user/login":
      //   setPage("UserLogin");
      //   break;
    
      default:
        setPage("AdminLogin");
    }
  };

  // ================= INIT ROUTE =================
  useEffect(() => {
    handleRoute(); // 🔥 important (initial load fix)

    window.addEventListener("hashchange", handleRoute);

    return () =>
      window.removeEventListener("hashchange", handleRoute);
  }, []);

  // ================= AUTH CHECK =================
  const isAdmin = localStorage.getItem("admin");

  return (
    <>
      {page === "admin" &&
        (isAdmin ? <Dashboard /> : <AdminLogin />)}

      {page === "createDepartment" &&
        (isAdmin ? <CreateDepartment /> : <AdminLogin />)}

      {page === "createUsers" &&
        (isAdmin ? <CreateUsers /> : <AdminLogin />)}

      {page === 'login' && <UserLogin />}

      {page === "AdminLogin" && <AdminLogin />}
    </>
  );
}

export default App;
