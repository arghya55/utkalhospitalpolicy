
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { api } from "../api";

const MediaUpload = ({ deptId }) => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  if (!user) {
    return (
      <div className="upload-locked-badge">
        🔒 Please Login to Upload Media
      </div>
    );
  }

  const MAX_SIZE = 50 * 1024 * 1024; // 50MB

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_SIZE) {
      return toast.error("File too large! Max allowed size is 50MB");
    }
    setFile(selectedFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please select or drop a file first");
    }

    try {
      const formData = new FormData();
      formData.append("title", title || file.name);
      formData.append("category", category);
      formData.append("departmentId", deptId);
      formData.append("file", file);
      formData.append("description", "");

      await api.post("/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
        },
        timeout: 0,
      });

      toast.success("File uploaded successfully");
      setTitle("");
      setCategory("General");
      setFile(null);
      setProgress(0);

      window.dispatchEvent(new Event("media-uploaded"));
    } catch (err) {
      console.error(err.response?.data);
      toast.error("Upload failed. Please try again.");
    }
  };

  return (
    <div className="media-upload-card">
      <h3 className="media-upload-title">Document & Resource Uploader</h3>
      
      <div className="form-fields-row">
        <input
          type="text"
          placeholder="Resource Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="media-input-text"
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="media-select-dropdown"
        >
          <option value="General">General</option>
          <option value="image">🖼️ Image</option>
          <option value="Ward File">📂 Ward File</option>
          <option value="Training Vedio">🎥 Training Video</option>
          <option value="Pdf">📄 PDF File</option>
          <option value="Excel Sheet">📊 Excel Sheet</option>
          <option value="Powerpoint">📉 Powerpoint</option>
        </select>
      </div>

      <div 
        {...getRootProps()} 
        className={`media-dropzone-zone ${isDragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <span className="dropzone-icon">📤</span>
          {file ? (
            <p className="file-selected-name">Selected: <strong>{file.name}</strong></p>
          ) : (
            <p>Drag & drop your file here, or <span className="browse-link">browse</span></p>
          )}
          <span className="file-size-limit">Maximum allowed file size: 50MB</span>
        </div>
      </div>

      {file && file.type.startsWith("image/") && (
        <div className="media-preview-container">
          <img
            src={URL.createObjectURL(file)}
            className="media-image-preview"
            alt="Upload preview"
          />
        </div>
      )}

      {progress > 0 && (
        <div className="progress-bar-container">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="progress-text">Uploading: {progress}%</span>
        </div>
      )}

      <button 
        className="media-submit-btn" 
        onClick={handleUpload}
        disabled={!file}
      >
        Start Upload Task
      </button>
    </div>
  );
};

export default MediaUpload;