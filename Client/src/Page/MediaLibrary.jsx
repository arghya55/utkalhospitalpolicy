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

import MediaCard from "../component/MediaCard";

import toast from "react-hot-toast";

import "../style/media.css";

const MediaLibrary = ({ deptId }) => {

  const [media, setMedia] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const user =
    JSON.parse(
      sessionStorage.getItem("user")
    );

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

    {/* TITLE */}

    <div className="navbar-heading">

      <h2 className="navbar-title">
        Media Library
      </h2>

      <p className="navbar-subtitle">
        Department Media Files
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