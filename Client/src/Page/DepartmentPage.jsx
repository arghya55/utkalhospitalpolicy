import React, { useEffect, useState } from "react";
import { api } from "../api";
import MediaUpload from "../Component/MediaUpload";
import "./DepartmentPage.css";

import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const DepartmentPage = ({ deptId }) => {
  const [department, setDepartment] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [sops, setSops] = useState([]);
  const [user, setUser] = useState(null);

  const [filterType, setFilterType] = useState("Policy");

  const [search, setSearch] = useState("");

  // POLICY MODAL
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // SOP MODAL
  const [showSopModal, setShowSopModal] = useState(false);
  const [editSop, setEditSop] = useState(null);

  const [showGoTop, setShowGoTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowGoTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  // const user = JSON.parse(sessionStorage.getItem("user"));

  // ================= FETCH USER =================
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(storedUser);
  }, []);

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

  const movePolicy = (index, direction) => {

    const updated = [...policies];

    if (
      direction === "up" &&
      index > 0
    ) {
      [
        updated[index - 1],
        updated[index],
      ] = [
          updated[index],
          updated[index - 1],
        ];
    }

    if (
      direction === "down" &&
      index < updated.length - 1
    ) {
      [
        updated[index + 1],
        updated[index],
      ] = [
          updated[index],
          updated[index + 1],
        ];
    }

    setPolicies(updated);
  };


  const moveSop = (index, direction) => {

    const updated = [...sops];

    if (
      direction === "up" &&
      index > 0
    ) {
      [
        updated[index - 1],
        updated[index],
      ] = [
          updated[index],
          updated[index - 1],
        ];
    }

    if (
      direction === "down" &&
      index < updated.length - 1
    ) {
      [
        updated[index + 1],
        updated[index],
      ] = [
          updated[index],
          updated[index + 1],
        ];
    }

    setSops(updated);
  };




  // ================= PERMISSION =================
  const canManage =
    user &&
    user.canAddPolicy &&
    String(user.department) ===
    String(department?._id);

  // ================= FILTERED DATA =================//
  const visiblePolicies = (
    canManage
      ? policies
      : policies.filter((p) => p.status === "Active")
  ).filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  const visibleSops = (
    canManage
      ? sops
      : sops.filter((s) => s.status === "Active")
  ).filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dept-container">

      {/* ================= NAVBAR ================= */}

      <div className="dept-header">

        <div className="main-navbar">

          {/* LEFT SECTION */}
          <div className="navbar-left">

            <button
              className="backbtn"
              onClick={() => (window.location.hash = "#/policy")}
            >
              ← Back
            </button>

            <button
              className="backbtnhome"
              onClick={() => (window.location.hash = "#/Home")}
            >
              ⌂ Home
            </button>

          </div>

          {/* CENTER */}
          <div className="navbar-center">

            <h1 className="dept-name">
              SOP / Policy of {department?.name || "Department"}
            </h1>

          </div>

          {/* RIGHT */}
          <div className="navbar-right">

            <input
              type="text"
              placeholder="Search SOP & Policy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="filter-box">

              <h4 className="select-to-view">
                Select To View Category
              </h4>

              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="filter-dropdown"
              >
                <option value="Policy">
                  Policy
                </option>

                <option value="SOP">
                  SOP
                </option>

              </select>

            </div>

            {canManage && (
              <>
                <button
                  className="add-policy-btn"
                  onClick={() =>
                    (window.location.hash = "#/page/addpolicy")
                  }
                >
                  Add Policy
                </button>

                <button
                  className="add-sop-btn"
                  onClick={() =>
                    (window.location.hash = "#/page/addsop")
                  }
                >
                  Add SOP
                </button>

                <MediaUpload deptId={deptId} />
              </>
            )}

            <button
              className="media-btn"
              onClick={() =>
                (window.location.hash = `#/media/${deptId}`)
              }
            >
              📁 Media
            </button>

            {user && (
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

          </div>

        </div>

      </div>
      <p className="filtertype-change-name">
        {filterType === "Policy"
          ? "Policy"
          : filterType}
      </p>
      {/* ================= POLICIES ================= */}
      {(filterType === "All" ||
        filterType === "Policy") && (

          <div className="policy-grid">

            {visiblePolicies.map((p, index) => (

              <div
                key={p._id}
                className="policy-card"
              >

                <div className="policy-header">

                  <div className="policy-title">
                    <h3>{index + 1}. {p.title}</h3>
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
                        className={`status-dropdown ${p.status === "Active"
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

                          {index !== 0 && (
                            <button
                          className="move-btn"
                          onClick={() => movePolicy(index, "up")}
                        >
                          ↑
                        </button>
                          )}
                        
                          {index!== visiblePolicies.length -1 && (
                             <button
                          className="move-btn"
                          onClick={() => movePolicy(index, "down")}
                        >
                          ↓
                        </button>
                          )}
                       

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

                <p>
                  {p.description.match(/.{1,139}(\s|$)/g)?.join("\n")}
                </p>

              </div>

            ))}

          </div>
        )}

      {/* ================= SOPS ================= */}
      {(filterType === "All" ||
        filterType === "SOP") &&
        visibleSops &&
        visibleSops.length > 0 && (

          <div className="policy-grid">

            {visibleSops.map((s, index) => (

              <div
                key={s._id}
                className="policy-card"
              >

                <div className="policy-header">

                  <div className="policy-title">
                    <h3>{index + 1}. {s.title}</h3>
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
                        className={`status-dropdown ${s.status === "Active"
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
                          {index !==0 && (
                            <button
                          className="move-btn"
                          onClick={() => moveSop(index, "up")}
                        >
                          ↑
                        </button>
                          )}
                        
                          {index!== visibleSops.length - 1 && (
                            <button
                          className="move-btn"
                          onClick={() => moveSop(index, "down")}
                        >
                          ↓
                        </button>
                          )}
                        

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

                <p>
                  {s.description.match(/.{1,139}(\s|$)/g)?.join("\n")}
                </p>

              </div>

            ))}

          </div>
        )}

      {/* ================= POLICY MODAL ================= */}
      {showModal && (
        <div className="modal">

          <div className="modal-content">

            <h2>Edit Policy</h2>
            <h4 >
              Write Policy Title Here
            </h4>
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
            <h4 >
              Write Policy Content Here
            </h4>
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
            <h4 >
              Write Sop Title Here
            </h4>
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
            <h4 >
              Write Sop Content Here
            </h4>

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
      <footer className="footer">

        <div className="footer-container">

          {/* LEFT */}

          <div className="footer-about">

            <h2>Utkal Healthcare Private Limited</h2>

            <div className="footer-contact">

              <h3>Contact Us</h3>

              <p>
                📧 it@utkalhospital.com
              </p>

              <p>
                📍 PLOT-321, PLOT NO-C/3,
                WARD -BH -C III, NILADRI VIHAR,
                BHUBANESWAR, Khordha,
                Odisha - 751021
              </p>

            </div>

          </div>

          {/* SERVICES */}

          <div className="footer-links">

            <h3>Quick Links</h3>

            <a href="#/policy">
              Departments
            </a>

            <a href={`#/media/${deptId}`}>
              Media Library
            </a>

            {canManage && (
              <a href="#/page/addpolicy">
                Add Policy
              </a>
            )}

            {canManage && (
              <a href="#/page/addsop">
                Add SOP
              </a>
            )}

            <a href="#/Home">
              Dashboard
            </a>

          </div>
          {showGoTop && (
            <div className="go-top-btn" onClick={scrollTop}>
              ↑ Go Top
            </div>
          )}

          {/* CONTACT */}



        </div>

        {/* BOTTOM */}

        <div className="footer-bottom">
          © 2026 | Developed by
          <span className="developer-name">
            {" "}Arghya Dey
          </span>
          {" "}from IT Department
        </div>

      </footer>
    </div>

  );
};

export default DepartmentPage;