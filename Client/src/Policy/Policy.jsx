import React, { useEffect, useState } from "react";
import { api } from "../api";
import logo from "../assets/utkal-logo.png";
import "./Policy.css";

const Policy = () => {

  const [departments, setDepartments] =
    useState([]);

  const [user, setUser] =
    useState(null);

  const [showGreeting, setShowGreeting] =
    useState(false);

  // ================= USER =================

  useEffect(() => {

    const storedUser = JSON.parse(
      sessionStorage.getItem("user")
    );

    setUser(storedUser);

    const greeting =
      sessionStorage.getItem(
        "showGreeting"
      );

    if (greeting === "true") {

      setShowGreeting(true);

      sessionStorage.removeItem(
        "showGreeting"
      );

      setTimeout(() => {
        setShowGreeting(false);
      }, 6000);
    }

  }, []);

  // ================= FETCH DEPARTMENT =================

  useEffect(() => {

    const fetchDepartments =
      async () => {

        try {

          const res =
            await api.get(
              "/departments"
            );

          setDepartments(
            res.data
          );

        } catch (err) {

          console.log(
            "Department fetch error:",
            err.response?.data ||
              err.message
          );
        }
      };

    fetchDepartments();

  }, []);

  return (

    <div className="policy-container">

      {/* ================= GREETING ANIMATION ================= */}

      {showGreeting && (

        <div className="greeting-overlay">

          {/* PARTICLES */}

          {[...Array(70)].map((_, i) => (

            <span
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 5}s`,
              }}
            />

          ))}

          {/* GLOW */}

          <div className="greeting-glow"></div>

          {/* CENTER BOX */}

          <div className="greeting-content">

            <img
              src={logo}
              alt="logo"
              className="greeting-logo"
            />

            <h2 className="welcome-text">
              Welcome
            </h2>

            <h1 className="animated-username">
              {user?.name}
            </h1>

            <p className="greeting-subtext">
              Utkal Hospital SOP &
              Policies System
            </p>

          </div>

        </div>

      )}

      {/* ================= HOME BUTTON ================= */}

      <button
        className="back-home-btn"
        onClick={() =>
          (window.location.hash =
            "#/home")
        }
      >
        ← Home
      </button>

      <div className="utkal-logo">
          <img
              src={logo}
              alt="logo"
              className="utkal-logo"
            />

      </div>

      {/* ================= TOP INFO ================= */}

      <div className="user-info">

        <h3>
          Welcome To Utkal Hospital
          SOP / Policies
        </h3>

      </div>
      <br />

      <h1>{user?.name}</h1>

      <h1 className="main-title">
        Please Select Your Department
      </h1>

      {/* ================= DEPARTMENTS ================= */}

      <div className="department-buttons">

        {departments.map((d) => (

          <button
            key={d._id}
            className="department-btn"
            onClick={() =>
              (window.location.hash =
                `#/department/${d._id}`)
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