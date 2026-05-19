// ================= MEDIA LIBRARY JSX =================

import React, {
  useEffect,
  useState,
} from "react";

import {
  FaBell,
  FaSearch,
  FaPlus,
} from "react-icons/fa";

import { api } from "../api";

import MediaCard from "../Component/MediaCard";

import toast from "react-hot-toast";

import "../Style/Media.css";

const MediaLibrary = ({ deptId }) => {

  const [media, setMedia] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

     const [user, setUser] = useState(null);
       const [department, setDepartment] = useState(null);

       useEffect(() => {
           const storedUser = JSON.parse(sessionStorage.getItem("user"));
           setUser(storedUser);
         }, []);

  useEffect(() => {
     const storedDepartment = JSON.parse(sessionStorage.getItem("department"));
           setDepartment(storedDepartment);
          }, []);

           const fetchDepartment = async () => {
              try {
                const res = await api.get("/departments");
          
                const found = res.data.find(
                  (d) => d._id === deptId
                );
          
                setDepartment(found);
          
              } catch (err) {
                console.log(err);
              }
            };

  useEffect(() => {
    fetchDepartment();
  }, [deptId]);

  // ================= FETCH =================

  useEffect(() => {
    fetchMedia();
  }, [deptId]);

  const fetchMedia = async () => {

    try {

      const res =
        await api.get(
          `/media?departmentId=${deptId}`
        );

      setMedia(res.data);

    } catch (err) {

      console.log(err);

    }
  };

  // ================= FILTER =================

  const filteredMedia =
    media.filter((m) => {

      const searchMatch =

        (m?.title || "")
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const categoryMatch =

        category === "All"
          ? true
          : m.category === category;

      return (
        searchMatch &&
        categoryMatch
      );
    });

  // ================= VISIBLE MEDIA =================
const isDepartmentUser =
  user?.role?.toLowerCase() ===
  "department";

  const visibleMedia =
    filteredMedia.filter((m) => {

      const ownDepartment =

        String(user?.role)
          .toLowerCase() ===
          "department"

        &&

        String(m?.department) ===
        String(user?.department);

      if (ownDepartment) {
        return true;
      }

      return (

        String(m?.status)
          .toLowerCase() ===
          "active"

      );
    });

  // ================= LIKE =================

  const handleLike =
    async (id) => {

      try {

        await api.put(
          `/media/${id}/like`
        );

        fetchMedia();

      } catch (err) {

        console.log(err);

      }
    };

  // ================= DELETE =================

  const handleDelete =
    async (id) => {

      try {

        await api.delete(
          `/media/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${user?.token}`,
            },
          }
        );

        toast.success(
          "Deleted Successfully"
        );

        fetchMedia();

      } catch (err) {

        console.log(err);

        toast.error(
          "Delete Failed"
        );

      }
    };

  // ================= STATUS =================

  const handleStatus =
    async (id, status) => {

      try {

        await api.put(
          `/media/${id}/status`,
          { status }
        );

        setMedia((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  status,
                }
              : item
          )
        );

      } catch (err) {

        console.log(err);

      }
    };

  // ================= JSX =================

  return (

    <div className="dashboard">

      <main className="content">

        {/* ================= NAVBAR ================= */}

<div className="top-navbar">

  {/* LEFT */}

  <div className="navbar-left">

    {/* BACK BUTTON */}

    <button
      className="back_btn"
      onClick={() =>
        (
          window.location.hash =
            "#/department/" +
            deptId
        )
      }
    >
      ← Back
    </button>
    <button
        className="backbtnhome"
        onClick={() => (window.location.hash = "#/Home")}
      >
        ⌂ Home
      </button>
      {user&& (
        <button
        className="logoutbtn"
        onClick={() => {
          localStorage.clear();
          sessionStorage.clear();
          window.location.hash = "#/";
        }}
      >
        Logout
      </button>
      )}
    

    {/* TITLE */}

    <div className="navbar-heading">

    <h1 className="navbar-title">
      Welcome to {department?.name || "Department"} Media Library
      {/* {user?.name ? ` : ${user.name}` : ""} */}
    </h1>
      <p className="navbar-subtitle">
         The {department?.name || "Department"} Department sincerely thanks you for reviewing the media files.
      </p>

    </div>

  </div>

  {/* RIGHT */}

  <div className="navbar-right">

    {/* SEARCH */}

    <div className="search-box">

      <FaSearch />

      <input
        type="text"
        placeholder="Search media..."
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

    </div>

    {/* CATEGORY */}

    <select
      className="category-select"
      value={category}
      onChange={(e) =>
        setCategory(
          e.target.value
        )
      }
    >

      <option value="All">
        All Categories
      </option>

      <option value="image">
        Image
      </option>

      <option value="Ward File">
        Ward File
      </option>

      <option value="Training Vedio">
        Training Video
      </option>

      <option value="Pdf">
        PDF
      </option>

      <option value="Excel">
        Excel
      </option>

      <option value="powerpoint">
        PowerPoint
      </option>

    </select>

    {/* COUNT */}

    <div className="count-box">

      <h2>
        {visibleMedia.length}
      </h2>

      <span>
        Files
      </span>

    </div>

    {/* NOTIFY */}

    <button className="notify-btn">
      <FaBell />
    </button>

  </div>

        </div>

        {/* ================= MEDIA GRID ================= */}

        <div className="media-grid">

          {visibleMedia.map((m) => (

            <MediaCard
              key={m._id}
              media={m}
              user={user}
              handleLike={handleLike}
              handleDelete={handleDelete}
              handleStatus={handleStatus}
            />

          ))}

        </div>

        {/* ================= FLOAT BUTTON ================= */}

        {String(user?.role)
          .toLowerCase() ===
          "department"

          &&

          String(user?.department) ===
          String(deptId) && (

          <button className="add-btn">

            <FaPlus />

          </button>

        )}

      </main>

    </div>
  );
};

export default MediaLibrary;