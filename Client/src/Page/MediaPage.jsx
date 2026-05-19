import React, { useEffect, useState } from "react";
import { api } from "../api";

const MediaPage = ({ deptId }) => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    fetchMedia();
  }, [deptId]);

  const fetchMedia = async () => {
    try {
      const res = await api.get(
        `/media?departmentId=${deptId}`
      );
      setMedia(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getType = (m) =>
    (m?.type || m?.category || "").toLowerCase();

  const isImage = (type) => type.includes("image");

  const isVideo = (type) =>
    type.includes("video") ||
    type.includes("vedio") ||
    type.includes("training");

  const fixUrl = (url, type = "") => {
    if (!url) return "";

    if (type.includes("image")) {
      return url.replace("/upload/", "/upload/q_auto,f_auto/");
    }

    return url;
  };

  return (
    <div className="media-page">
      <h2 className="page-title">Department Media</h2>

      <div className="media-grid">
        {media.map((m) => {
          const type = getType(m);

          return (
            <div key={m._id} className="media-card">

              {/* TITLE ALWAYS VISIBLE */}
              <h3 className="media-title">
                {m.title || "Untitled Media"}
              </h3>

              {/* IMAGE */}
              {isImage(type) && (
                <img
                  src={fixUrl(m.url, type)}
                  alt={m.title}
                  className="media-img"
                />
              )}

              {/* VIDEO */}
              {isVideo(type) && (
                <video
                  className="media-video"
                  controls
                  preload="metadata"
                  playsInline
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                >
                  <source src={m.url} type="video/mp4" />
                  Your browser does not support video.
                </video>
              )}

              {/* FILE */}
              {!isImage(type) && !isVideo(type) && (
                <div className="file-box">
                  <p>📄 {m.type || "File"}</p>

                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open File
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MediaPage;