import React, { useEffect, useState } from "react";
import { api } from "../api";

const MediaPage = ({ deptId }) => {
  const [media, setMedia] = useState([]);

  useEffect(() => {
    fetchMedia();
  }, [deptId]);

  const fetchMedia = async () => {
    try {
      const res = await api.get(`/media?departmentId=${deptId}`);
      setMedia(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 CLOUDINARY FIX
  const fixUrl = (url) =>
    url?.replace("/upload/", "/upload/q_auto,f_auto/");

  return (
    <div className="media-page">
      <h2>Department Media</h2>

      <div className="media-grid">
        {media.map((m) => {
          const type = (m.type || "").toLowerCase();

          return (
            <div key={m._id} className="media-card">
              <h3>{m.title}</h3>

              {/* IMAGE */}
              {type === "image" && (
                <img
                  src={fixUrl(m.url)}
                  alt={m.title}
                  width="300"
                  style={{ borderRadius: "8px" }}
                />
              )}

              {/* VIDEO */}
              {type === "video" && (
                <video
                  src={fixUrl(m.url)}
                  controls
                  width="350"
                  preload="metadata"
                  style={{ borderRadius: "8px" }}
                />
              )}

              {/* FILE */}
              {type !== "image" && type !== "video" && (
                <div>
                  <p>📄 {m.type || "file"}</p>
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