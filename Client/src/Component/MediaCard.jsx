import React, {
  useState,
} from "react";

import {
  FaHeart,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
} from "react-icons/fa";

import "../Style/Media.css";

// IMPORTANT
const BACKEND_URL =
  "https://utkalpolicybackend.onrender.com";

const MediaCard = ({
  media,
  user,
  handleLike,
  handleStatus,
  handleDelete,
}) => {

  const [preview, setPreview] =
    useState(false);

  if (!media) return null;

  // FULL URL FIX
  const mediaUrl =
    media?.url?.startsWith("http")
      ? media.url
      : `${BACKEND_URL}${media.url.replace(/\\/g, "/")}`;

  // ROLE

  const isDepartmentUser =
    user?.role?.toLowerCase() ===
    "department";

  const canDelete =
    isDepartmentUser &&
    String(user?._id) ===
    String(media?.uploadedBy);

  // FILE OPEN

  const openFile = () => {

    // IMPORTANT FIX
    window.open(
      mediaUrl,
      "_blank"
    );
  };

  return (

    <div className="media-card">

      {/* IMAGE */}

      {media?.type === "image" && (

        <>
          <img
            src={mediaUrl}
            alt={media?.title}
            className="card-media"
            onClick={() =>
              setPreview(true)
            }
          />

       {preview && (
  <div
    onClick={() => setPreview(false)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.96)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999999,
      cursor: "pointer",
    }}
  >
    <img
      src={mediaUrl}
      alt=""
      style={{
        width: "100vw",
        height: "100vh",
        objectFit: "contain",
      }}
    />
  </div>
)}
        </>
      )}

      {/* VIDEO */}

      {media?.type === "video" && (

        <video
          controls
          className="card-media"
          preload="metadata"
        >

          <source
            src={mediaUrl}
              type={media.mimetype || "video/mp4"}
          />

        </video>
      )}

      {/* FILE */}

      {(media?.type === "pdf" ||
        media?.type === "doc" ||
        media?.type === "excel" ||
        media?.type === "ppt") && (

        <div className="file-box">

          {media?.type === "pdf" && (
            <FaFilePdf className="file-icon pdf" />
          )}

          {media?.type === "doc" && (
            <FaFileWord className="file-icon word" />
          )}

          {media?.type === "excel" && (
            <FaFileExcel className="file-icon excel" />
          )}

          {media?.type === "ppt" && (
            <FaFilePowerpoint className="file-icon ppt" />
          )}

          <button
            className="open-btn"
            onClick={openFile}
          >
            Open File
          </button>

        </div>
      )}

      {/* BODY */}

      <div className="card-body">

        <span
          className={`badge ${media?.status}`}
        >
          {media?.status}
        </span>

        <h3>
          {media?.title}
        </h3>

        <p className="category">
          {media?.category}
        </p>

        <div className="actions">

          <button
            className="like-btn"
            onClick={() =>
              handleLike(media._id)
            }
          >
            <FaHeart />
            {media?.likes || 0}
          </button>

          {canDelete && (

            <button
              className="delete-btn"
              onClick={() =>
                handleDelete(media._id)
              }
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCard;