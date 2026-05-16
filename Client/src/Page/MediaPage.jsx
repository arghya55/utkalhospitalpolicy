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

  const fixUrl = (url) =>
    url?.replace(
      "/upload/",
      "/upload/q_auto,f_auto/"
    );

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
                  src={fixUrl(m.url)}
                  alt={m.title}
                  width="300"
                  style={{
                    borderRadius:
                      "8px",
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
                  width="350"
                  height="250"
                  controls
                  preload="metadata"
                  style={{
                    borderRadius:
                      "10px",

                    background:
                      "#000",

                    objectFit:
                      "cover",
                  }}
                >
                  <source
                    src={fixUrl(
                      m.url
                    )}
                    type="video/mp4"
                  />

                  Your browser
                  does not
                  support video.
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