
import React, { useEffect, useState } from "react";
import { api } from "../api";
import MediaUpload from "../Component/MediaUpload";
import "./DepartmentPage.css";

const DepartmentPage = ({ deptId }) => {
  const [department, setDepartment] = useState(null);
  const [policies, setPolicies] = useState([]);
  const [sops, setSops] = useState([]);
  const [user, setUser] = useState(null);
  const [filterType, setFilterType] = useState("Policy");
  const [search, setSearch] = useState("");

  // MODALS STATES
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showSopModal, setShowSopModal] = useState(false);
  const [editSop, setEditSop] = useState(null);
  const [showGoTop, setShowGoTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowGoTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    setUser(storedUser);
  }, []);

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

  const fetchDepartment = async () => {
    try {
      const res = await api.get("/departments");
      const found = res.data.find((d) => d._id === deptId);
      setDepartment(found);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPolicies = async () => {
    try {
      const res = await api.get(`/policies?departmentId=${deptId}`);
     const sorted = res.data.sort(
  (a, b) => a.order - b.order
);

setPolicies(sorted);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchSops = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await api.get(`/sops?departmentId=${deptId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const sorted = res.data.sort(
  (a, b) => a.order - b.order
);

setSops(sorted);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete policy?")) return;
    try {
      await api.delete(`/policies/${id}`);
      setPolicies((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("❌ Delete failed");
    }
  };

  const handleSopDelete = async (id) => {
    if (!window.confirm("Delete SOP?")) return;
    try {
      await api.delete(`/sops/${id}`);
      setSops((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      alert("❌ SOP delete failed");
    }
  };

  const handleEdit = (policy) => {
    setEditData(policy);
    setShowModal(true);
  };

  const handleSopEdit = (sop) => {
    setEditSop(sop);
    setShowSopModal(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await api.put(`/policies/${editData._id}`, {
        title: editData.title,
        description: editData.description,
        status: editData.status,
      });
      setPolicies((prev) => prev.map((p) => (p._id === editData._id ? res.data : p)));
      setShowModal(false);
    } catch (err) {
      alert("❌ Update failed");
    }
  };

  const handleSopUpdate = async () => {
    try {
      const res = await api.put(`/sops/${editSop._id}`, {
        title: editSop.title,
        description: editSop.description,
        status: editSop.status,
      });
      setSops((prev) => prev.map((s) => (s._id === editSop._id ? res.data : s)));
      setShowSopModal(false);
    } catch (err) {
      alert("❌ SOP update failed");
    }
  };

  const handleStatusChange = async (id, type, status) => {
    try {
      if (type === "policy") {
        const res = await api.put(`/policies/${id}`, { status });
        setPolicies((prev) => prev.map((p) => (p._id === id ? res.data : p)));
      } else {
        const res = await api.put(`/sops/${id}`, { status });
        setSops((prev) => prev.map((s) => (s._id === id ? res.data : s)));
      }
    } catch (err) {
      alert("❌ Status update failed");
    }
  };

  const movePolicy = async (
  index,
  direction
) => {

  const updated = [...policies];

  if (
    direction === "up" &&
    index > 0
  ) {

    [updated[index - 1], updated[index]] =
      [updated[index], updated[index - 1]];
  }

  if (
    direction === "down" &&
    index < updated.length - 1
  ) {

    [updated[index + 1], updated[index]] =
      [updated[index], updated[index + 1]];
  }

  setPolicies(updated);

  try {

    await api.put(
      "/policies/reorder",
      {
        items: updated,
      }
    );

  } catch (err) {

    console.log(err);

    alert("Reorder failed");
  }
};

  const moveSop = async (
  index,
  direction
) => {

  const updated = [...sops];

  if (
    direction === "up" &&
    index > 0
  ) {

    [updated[index - 1], updated[index]] =
      [updated[index], updated[index - 1]];
  }

  if (
    direction === "down" &&
    index < updated.length - 1
  ) {

    [updated[index + 1], updated[index]] =
      [updated[index], updated[index + 1]];
  }

  setSops(updated);

  try {

    await api.put(
      "/sops/reorder",
      {
        items: updated,
      }
    );

  } catch (err) {

    console.log(err);

    alert("Reorder failed");
  }
};

  const canManage = user && user.canAddPolicy && String(user.department) === String(department?._id);

  const visiblePolicies = (canManage ? policies : policies.filter((p) => p.status === "Active")).filter(
    (p) => p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
  );

  const visibleSops = (canManage ? sops : sops.filter((s) => s.status === "Active")).filter(
    (s) => s.title.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dept-dashboard-container">
      {/* ================= MODERN DYNAMIC NAVBAR ================= */}
      {/* ================= MODERN DYNAMIC NAVBAR ================= */}
<header className="main-app-header">

  <div className="header-wrapper">

    {/* LEFT */}
    <div className="header-left">

      <button
        className="nav-action-btn"
        onClick={() => (window.location.hash = "#/policy")}
      >
        ← Back
      </button>

      <button
        className="add-policy-btn"
        onClick={() => (window.location.hash = "#/Home")}
      >
        ⌂ Home
      </button>

    </div>

    {/* CENTER */}
    <div className="header-center">

      <h1 className="header-dept-title">
        SOP / Policy of {department?.name || "Department"}
      </h1>

    </div>

    {/* RIGHT */}
    <div className="header-right">

      {/* SEARCH */}
      <div className="search-bar-wrapper">

        <span className="search-icon">
          🔍
        </span>

        <input
  type="text"
  placeholder="Search SOP / Policy..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="search-input"
/>

      </div>

      {/* FILTER */}
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="category-select"
      >
        <option value="Policy">
          Policy
        </option>

        <option value="SOP">
          SOP
        </option>
      </select>

      {/* ACTIONS */}
      {canManage && (

        <div className="management-actions-group">

          <button
            className="add-policy-btn"
            onClick={() =>
              (window.location.hash = "#/page/addpolicy")
            }
          >
            + Policy
          </button>

          <button
            className="add-sop-btn"
            onClick={() =>
              (window.location.hash = "#/page/addsop")
            }
          >
            + SOP
          </button>

        </div>
      )}

      {/* MEDIA */}
      <button
        className="nav-media-library-btn"
        onClick={() =>
          (window.location.hash = `#/media/${deptId}`)
        }
      >
        📁 Media
      </button>

      {/* LOGOUT */}
      {user && (
        <button
          className="nav-logout-btn"
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

</header>
{canManage && (<div className="dashboard-content-main">
  <MediaUpload deptId={deptId} />
</div>
)}

      {/* ================= CENTRAL CONTAINER ================= */}
      <main className="dashboard-content-main">
        <div className="policy-badge-container">
          <div className="floating-policy-badge">{filterType.toUpperCase()}</div>
        </div>

        {/* ================= POLICIES RENDERING ================= */}
        {["All", "Policy"].includes(filterType) && (
          <div className="cards-grid-stack">
            {visiblePolicies.map((p, index) => (
              <div key={p._id} className="premium-policy-card">
                <div className="card-gradient-edge green-to-blue"></div>
                <div className="card-inner-body">
                  <div className="card-upper-header">
                    <h2 className="policy-display-title">
                      {index + 1}. {p.title}
                    </h2>

                    <div className="card-controls-cluster">
                      {canManage && (
                        <select
                          value={p.status}
                          onChange={(e) => handleStatusChange(p._id, "policy", e.target.value)}
                          className={`status-select-badge ${p.status === "Active" ? "badge-active" : "badge-inactive"}`}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      )}

                      {canManage && (
                        <div className="control-buttons-group">
                          <button className="control-btn edit-action" onClick={() => handleEdit(p)}>
                            ✏️ Edit
                          </button>

                          {index !== 0 && (
                            <button className="control-btn order-action" onClick={() => movePolicy(index, "up")} title="Move Up">
                              ↑
                            </button>
                          )}

                          {index !== visiblePolicies.length - 1 && (
                            <button className="control-btn order-action" onClick={() => movePolicy(index, "down")} title="Move Down">
                              ↓
                            </button>
                          )}

                          <button className="control-btn delete-action" onClick={() => handleDelete(p._id)}>
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="policy-paragraphs-content">
                    {p.description.split("\n").map((para, idx) => para.trim() && <p key={idx}>{para}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= SOPS RENDERING ================= */}
        {["All", "SOP"].includes(filterType) && visibleSops && visibleSops.length > 0 && (
          <div className="cards-grid-stack">
            {visibleSops.map((s, index) => (
              <div key={s._id} className="premium-policy-card">
                <div className="card-gradient-edge green-to-cyan"></div>
                <div className="card-inner-body">
                  <div className="card-upper-header">
                    <h2 className="policy-display-title">
                      {index + 1}. {s.title}
                    </h2>

                    <div className="card-controls-cluster">
                      {canManage && (
                        <select
                          value={s.status}
                          onChange={(e) => handleStatusChange(s._id, "sop", e.target.value)}
                          className={`status-select-badge ${s.status === "Active" ? "badge-active" : "badge-inactive"}`}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      )}

                      {canManage && (
                        <div className="control-buttons-group">
                          <button className="control-btn edit-action" onClick={() => handleSopEdit(s)}>
                            ✏️ Edit
                          </button>

                          {index !== 0 && (
                            <button className="control-btn order-action" onClick={() => moveSop(index, "up")} title="Move Up">
                              ↑
                            </button>
                          )}

                          {index !== visibleSops.length - 1 && (
                            <button className="control-btn order-action" onClick={() => moveSop(index, "down")} title="Move Down">
                              ↓
                            </button>
                          )}

                          <button className="control-btn delete-action" onClick={() => handleSopDelete(s._id)}>
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="policy-paragraphs-content">
                    {s.description.split("\n").map((para, idx) => para.trim() && <p key={idx}>{para}</p>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ================= POLICY EDIT MODAL ================= */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Edit Policy Document</h3>
            <label>Policy Title</label>
            <input value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />

            <label>Policy Content</label>
            <textarea rows={6} value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />

            <label>Document Status</label>
            <select value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="modal-action-footer">
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="modal-btn save" onClick={handleUpdate}>
                Update Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= SOP EDIT MODAL ================= */}
      {showSopModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Edit SOP Document</h3>
            <label>SOP Title</label>
            <input value={editSop.title} onChange={(e) => setEditSop({ ...editSop, title: e.target.value })} />

            <label>SOP Content</label>
            <textarea rows={6} value={editSop.description} onChange={(e) => setEditSop({ ...editSop, description: e.target.value })} />

            <label>Document Status</label>
            <select value={editSop.status} onChange={(e) => setEditSop({ ...editSop, status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <div className="modal-action-footer">
              <button className="modal-btn cancel" onClick={() => setShowSopModal(false)}>
                Cancel
              </button>
              <button className="modal-btn save" onClick={handleSopUpdate}>
                Update SOP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= BACK TO TOP DYNAMIC BUTTON ================= */}
      {showGoTop && (
        <button className="floating-scroll-top" onClick={scrollTop}>
          ↑ Go Top
        </button>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="dashboard-footer">
        <div className="footer-inner-container">
          <div className="footer-col-about">
            <h2>Utkal Healthcare Private Limited</h2>
            <div className="footer-contact-details">
              <h3>Contact Support</h3>
              <p>📧 it@utkalhospital.com</p>
              <p>📍 PLOT-321, PLOT NO-C/3, NILADRI VIHAR, BHUBANESWAR, Odisha - 751021</p>
            </div>
          </div>

          <div className="footer-col-links">
            <h3>Quick Actions</h3>
            <a href="#/policy">Departments</a>
            <a href={`#/media/${deptId}`}>Media Library</a>
            <a href="#/Home">Dashboard</a>
            {canManage && (
              <a href="#/page/addpolicy">Add Policy</a>,
              <a href="#/page/addsop">Add Sop</a>
            )}
          </div>
        </div>

        <div className="footer-copyright-bar">
          © 2026 | Developed by <span className="dev-name">Arghya Dey</span> from IT Department
        </div>
      </footer>
    </div>
  );
};

export default DepartmentPage;