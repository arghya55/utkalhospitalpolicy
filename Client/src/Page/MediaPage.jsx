import React, {
  useEffect,
  useState,
} from "react";

import { api } from "../api";

const MediaPage = ({
  deptId,
}) => {

  const [media, setMedia] =
    useState([]);

  useEffect(() => {
    fetchMedia();
  }, [deptId]);

  const fetchMedia =
    async () => {

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

  const fixUrl = (url, type = "") => {

    // IMAGE optimization
    if (type.includes("image")) {

      return url?.replace(
        "/upload/",
        "/upload/q_auto,f_auto/"
      );
    }

    // VIDEO no optimization
    return url;
  };

  return (
    <div className="media-page">

      <h2>
        Department Media
      </h2>

      <div className="media-grid">

        {media.map((m) => {

          const type =
            (
              m.type ||
              m.category ||
              ""
            ).toLowerCase();

          return (

            <div
              key={m._id}
              className="media-card"
            >

              <h3>{m.title}</h3>

              {/* IMAGE */}

              {type.includes("image") && (

                <img
                  src={fixUrl(m.url, type)}
                  alt={m.title}
                  width="300"
                  style={{
                    borderRadius: "8px",
                  }}
                />
              )}

              {/* VIDEO */}

              {(
                type.includes(
                  "video"
                ) ||
                type.includes(
                  "vedio"
                ) ||
                type.includes(
                  "training"
                )
              ) && (

                  <video
                    className="media-video"
                    controls
                    preload="metadata"
                    playsInline
                  >
                    <source
                      src={m.url}
                      type="video/mp4"
                    />

                    Your browser does not support video.
                  </video>
                )}

              {/* FILE */}

              {!(
                type.includes(
                  "image"
                ) ||
                type.includes(
                  "video"
                ) ||
                type.includes(
                  "vedio"
                ) ||
                type.includes(
                  "training"
                )
              ) && (

                  <div>

                    <p>
                      📄{" "}
                      {m.type ||
                        "file"}
                    </p>

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