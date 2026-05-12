import React, { useEffect, useState } from "react";
import { api } from "../api";
import MediaUpload from "../Component/MediaUpload";
import "./DepartmentPage.css";

const DepartmentPage = ({ deptId }) => {
  const [department, setDepartment] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [sops, setSops] = useState([]);
  const [filterType, setFilterType] = useState("All");

  // POLICY MODAL
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // SOP MODAL
  const [showSopModal, setShowSopModal] = useState(false);
  const [editSop, setEditSop] = useState(null);

  const user = JSON.parse(sessionStorage.getItem("user"));

  // ================= FETCH =================
  useEffect(() => {
    if (!deptId) return;

    fetchDepartment();
    fetchPolicies();
    fetchSops();

    const policyHandler = () => fetchPolicies();
    const sopHandler = () => fetchSops();

    window.addEventListener("policy-added", policyHandler);
    window.addEventListener("sop-added", sopHandler);

    return () => {
      window.removeEventListener("policy-added", policyHandler);
      window.removeEventListener("sop-added", sopHandler);
    };
  }, [deptId]);

  // ================= FETCH DEPARTMENT =================
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

  // ================= FETCH POLICIES =================
  const fetchPolicies = async () => {
    try {
      const res = await api.get(
        `/policies?departmentId=${deptId}`
      );

      setPolicies(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= FETCH SOPS =================
  const fetchSops = async () => {
    try {
          const token = sessionStorage.getItem("token");
      const res = await api.get(
        `/sops?departmentId=${deptId}`,
         {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
      );

    console.log("SOPS:", res.data); // 🔥 DEBUG
      setSops(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  // ================= POLICY DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete policy?")) return;

    try {
      await api.delete(`/policies/${id}`);

      setPolicies((prev) =>
        prev.filter((p) => p._id !== id)
      );

    } catch (err) {
      console.log(err);
      alert("❌ Delete failed");
    }
  };

  // ================= SOP DELETE =================
  const handleSopDelete = async (id) => {
    if (!window.confirm("Delete SOP?")) return;

    try {
      await api.delete(`/sops/${id}`);

      setSops((prev) =>
        prev.filter((s) => s._id !== id)
      );

    } catch (err) {
      console.log(err);
      alert("❌ SOP delete failed");
    }
  };

  // ================= POLICY EDIT =================
  const handleEdit = (policy) => {
    setEditData(policy);
    setShowModal(true);
  };

  // ================= SOP EDIT =================
  const handleSopEdit = (sop) => {
    setEditSop(sop);
    setShowSopModal(true);
  };

  // ================= POLICY UPDATE =================
  const handleUpdate = async () => {
    try {
      const res = await api.put(
        `/policies/${editData._id}`,
        {
          title: editData.title,
          description: editData.description,
          status: editData.status,
        }
      );

      setPolicies((prev) =>
        prev.map((p) =>
          p._id === editData._id
            ? res.data
            : p
        )
      );

      setShowModal(false);

    } catch (err) {
      console.log(err);
      alert("❌ Update failed");
    }
  };

  // ================= SOP UPDATE =================
  const handleSopUpdate = async () => {
    try {
      const res = await api.put(
        `/sops/${editSop._id}`,
        {
          title: editSop.title,
          description: editSop.description,
          status: editSop.status,
        }
      );

      setSops((prev) =>
        prev.map((s) =>
          s._id === editSop._id
            ? res.data
            : s
        )
      );

      setShowSopModal(false);

    } catch (err) {
      console.log(err);
      alert("❌ SOP update failed");
    }
  };

  // ================= STATUS UPDATE =================
  const handleStatusChange = async (
    id,
    type,
    status
  ) => {
    try {

      if (type === "policy") {

        const res = await api.put(
          `/policies/${id}`,
          { status }
        );

        setPolicies((prev) =>
          prev.map((p) =>
            p._id === id
              ? res.data
              : p
          )
        );

      } else {

        const res = await api.put(
          `/sops/${id}`,
          { status }
        );

        setSops((prev) =>
          prev.map((s) =>
            s._id === id
              ? res.data
              : s
          )
        );
      }

    } catch (err) {
      console.log(err);
      alert("❌ Status update failed");
    }
  };

  // ================= PERMISSION =================
  const canManage =
    user &&
    user.canAddPolicy &&
    String(user.department) ===
      String(department?._id);

        // ================= FILTERED DATA =================//
  const visiblePolicies = canManage
  ? policies
  : policies.filter((p) => p.status === "Active");

const visibleSops = canManage
  ? sops
  : sops.filter((s) => s.status === "Active");

  return (
    <div className="dept-container">
      
      {/* ================= NAVBAR ================= */}

<div className="dept-header">

  {/* LEFT SIDE */}
  <div className="nav-left">

    <button
      className="backbtn"
      onClick={() =>
        (window.location.hash =
          "#/policy")
      }
    >
      ← Back
    </button>

  </div>

  {/* RIGHT SIDE */}
  <div className="nav-right">

    {/* FILTER */}
    <div className="filter-box">

  <h4 className="catagory">
    Category
  </h4>

  <select
    value={filterType}
    onChange={(e) =>
      setFilterType(e.target.value)
    }
    className="filter-dropdown"
  >
    <option value="All">All</option>
    <option value="Policy">Policy</option>
    <option value="SOP">SOP</option>
  </select>

</div>

    {/* MEDIA UPLOAD */}
    {canManage && (
      <MediaUpload deptId={deptId} />
    )}

    {/* MEDIA LIBRARY */}
    <button
      className="media-btn"
      onClick={() =>
        (window.location.hash =
          `#/media/${deptId}`)
      }
    >
      📁 Media Library
    </button>

    {/* ADD POLICY */}
    {canManage && (
      <button
        className="add-policy-btn"
        onClick={() =>
          (window.location.hash =
            "#/page/addpolicy")
        }
      >
        + Policy
      </button>
    )}

    {/* ADD SOP */}
    {canManage && (
      <button
        className="add-sop-btn"
        onClick={() =>
          (window.location.hash =
            "#/page/addsop")
        }
      >
        + SOP
      </button>
    )}

  </div>

    <h1 className="dept-name">Department: {department?.name}</h1>

</div>

      {/* ================= POLICIES ================= */}
      {(filterType === "All" ||
        filterType === "Policy") && (

        <div className="policy-grid">

          {visiblePolicies.map((p) => (

            <div
              key={p._id}
              className="policy-card"
            >

              <div className="policy-header">

                <div className="policy-title">
                  <h3>{p.title}</h3>
                </div>

                <div className="policy-right">
                  {canManage && (
                    <select
                    value={p.status}
                    onChange={(e) =>
                      handleStatusChange(
                        p._id,
                        "policy",
                        e.target.value
                      )
                    }
                    className={`status-dropdown ${
                      p.status === "Active"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>
                  )}
                  

                  {canManage && (
                    <div className="card-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(p)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(p._id)
                        }
                      >
                        🗑 Delete
                      </button>

                    </div>
                  )}

                </div>

              </div>

              <p>{p.description}</p>

            </div>

          ))}

        </div>
      )}

      {/* ================= SOPS ================= */}
      {visibleSops && visibleSops.length > 0  && (

        <div className="policy-grid">

          {visibleSops.map((s) => (

            <div
              key={s._id}
              className="policy-card"
            >

              <div className="policy-header">

                <div className="policy-title">
                  <h3>{s.title}</h3>
                </div>

                <div className="policy-right">

                  {canManage && (
                    <select
                    value={s.status}
                    onChange={(e) =>
                      handleStatusChange(
                        s._id,
                        "sop",
                        e.target.value
                      )
                    }
                    className={`status-dropdown ${
                      s.status === "Active"
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>
                  )}

                  {canManage && (
                    <div className="card-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleSopEdit(s)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleSopDelete(s._id)
                        }
                      >
                        🗑 Delete
                      </button>

                    </div>
                  )}

                </div>

              </div>

              <p>{s.description}</p>

            </div>

          ))}

        </div>
      )}

      {/* ================= POLICY MODAL ================= */}
      {showModal && (
        <div className="modal">

          <div className="modal-content">

            <h2>Edit Policy</h2>

            <input
              value={editData.title}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  title:
                    e.target.value,
                })
              }
            />

            <textarea
              value={
                editData.description
              }
              onChange={(e) =>
                setEditData({
                  ...editData,
                  description:
                    e.target.value,
                })
              }
            />

            <select
              value={editData.status}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  status:
                    e.target.value,
                })
              }
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

            <div className="modal-actions">

              <button
                onClick={() =>
                  setShowModal(false)
                }
              >
                Cancel
              </button>

              <button
                onClick={
                  handleUpdate
                }
              >
                Update
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ================= SOP MODAL ================= */}
      {showSopModal && (
        <div className="modal">

          <div className="modal-content">

            <h2>Edit SOP</h2>

            <input
              value={editSop.title}
              onChange={(e) =>
                setEditSop({
                  ...editSop,
                  title:
                    e.target.value,
                })
              }
            />

            <textarea
              value={
                editSop.description
              }
              onChange={(e) =>
                setEditSop({
                  ...editSop,
                  description:
                    e.target.value,
                })
              }
            />

            <select
              value={editSop.status}
              onChange={(e) =>
                setEditSop({
                  ...editSop,
                  status:
                    e.target.value,
                })
              }
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>

            </select>

            <div className="modal-actions">

              <button
                onClick={() =>
                  setShowSopModal(false)
                }
              >
                Cancel
              </button>

              <button
                onClick={
                  handleSopUpdate
                }
              >
                Update SOP
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default DepartmentPage;