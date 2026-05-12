import React, {
  useState,
} from "react";

import {
  useDropzone,
} from "react-dropzone";

import toast from "react-hot-toast";

import { api } from "../api";

const MediaUpload = ({
  deptId,
}) => {

  const user = JSON.parse(
    sessionStorage.getItem(
      "user"
    )
  );

  const [title, setTitle] =
    useState("");

  const [category, setCategory] =
    useState("General");

  const [file, setFile] =
    useState(null);

  const [progress, setProgress] =
    useState(0);

  // ===== LOGIN CHECK =====

  if (!user) {
    return (
      <div className="upload-lock">
        🔒 Please Login To Upload
      </div>
    );
  }

  // ===== DROPZONE =====

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

const onDrop = (acceptedFiles) => {
  const selectedFile = acceptedFiles[0];

  if (selectedFile.size > MAX_SIZE) {
    return toast.error("File too large! Max allowed size is 50MB");
  }

  setFile(selectedFile);
};

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop,
  });

  // ===== UPLOAD =====

  const handleUpload =
    async () => {

      if (!file) {
        return toast.error(
          "Select File"
        );
      }

      try {

        const formData =
          new FormData();

        formData.append(
          "title",
          title
        );

        formData.append(
          "category",
          category
        );

        formData.append(
          "departmentId",
          deptId
        );

        formData.append(
          "file",
          file
        );
        formData.append("description", "");

    await api.post("/media/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },

  // 🔥 better progress tracking
  onUploadProgress: (e) => {
    const percent = Math.round((e.loaded * 100) / e.total);
    setProgress(percent);
  },

  // 🔥 important: reduce timeout issue
  timeout: 0,
});

        toast.success(
          "Upload Success"
        );

        setTitle("");
        setCategory(
          "General"
        );

        setFile(null);

        setProgress(0);

        window.dispatchEvent(
          new Event(
            "media-uploaded"
          )
        );

      } catch (err) {

        console.log(err.response?.data);

        toast.error(
          "Upload Failed"
        );
      }
    };

  return (
    <div className="media-upload">

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value
          )
        }
      />

      <select
        value={category}
        onChange={(e) =>
          setCategory(
            e.target.value
          )
        }
      >
        <option value="All">
          All
        </option>

        <option value="image">
          Image
        </option>

        <option value="Ward File">
          Ward File
        </option>

        <option value="Training Vedio">
          Training Vedio
        </option>

        <option value="Pdf">
          Pdf
        </option>

        <option value="Excel Sheet">
          Excel Sheet
        </option>
        
        <option value="Powerpoint">
          Powerpoint
        </option>

      </select>

      <div
        {...getRootProps()}
        className="dropzone"
      >
        <input
          {...getInputProps()}
        />

        <p>
          Drag & Drop File
        </p>
      </div>

      {file && (
        <div>

          <p>
            {file.name}
          </p>

          {file.type.startsWith(
            "image"
          ) && (
            <img
              src={URL.createObjectURL(
                file
              )}
              width="200"
              alt=""
            />
          )}
        </div>
      )}

      <div>
        Upload Progress:
        {progress}%
      </div>

      <button
        onClick={
          handleUpload
        }
      >
        Upload
      </button>

    </div>
  );
};

export default MediaUpload;