import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    departments: 0,
    policies: 0,
    sops: 0,
  });

  const [chartData, setChartData] = useState([]);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      const users = await axios.get("/users");
      const departments = await axios.get("/departments");
      const policies = await axios.get("/policies");
      const sops = await axios.get("/sops");

      setStats({
        users: users.data.length,
        departments: departments.data.length,
        policies: policies.data.length,
        sops: sops.data.length,
      });

      // Example chart data
      setChartData([
        { name: "Users", value: users.data.length },
        { name: "Departments", value: departments.data.length },
        { name: "Policies", value: policies.data.length },
        { name: "SOPs", value: sops.data.length },
      ]);
    };

    fetchData();
  }, []);

  const COLORS = ["#38bdf8", "#6366f1", "#22c55e"];

  return (
    <div className="dashboard">
      <Sidebar />

      <div className="dashboard-container">
        <h1>📊 Admin Dashboard</h1>

        {/* ================= STATS ================= */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p>{stats.users}</p>
          </div>

          <div className="stat-card">
            <h3>Departments</h3>
            <p>{stats.departments}</p>
          </div>

          <div className="stat-card">
            <h3>Policies</h3>
            <p>{stats.policies}</p>
          </div>

          <div className="stat-card">
            <h3>SOPs</h3>
            <p>{stats.sops}</p>
          </div>
        </div>

        {/* ================= CHARTS ================= */}
        <div className="charts">

          {/* BAR CHART */}
          <div className="chart-box">
            <h3>System Overview</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* PIE CHART */}
          <div className="chart-box">
            <h3>Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  outerRadius={80}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>

       
        {/* ================= RECENT ================= */}
        

      </div>
    </div>
  );
};

export default Dashboard;
