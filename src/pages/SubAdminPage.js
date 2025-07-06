import React, { useState, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import { Snackbar, Alert } from "@mui/material";
import "./SubAdminPage.css";

const defaultPermissions = {
  users: { update: false, delete: false, suspend: false, ban: false },
  business: { create: false, manage: false, approve: false, deny: false },
  events: { update: false, approve: false, deny: false },
  services: { view: false, approve: false, deny: false },
};

const ensurePermissions = (source) => {
  return {
    users: {
      update: source?.users?.update ?? false,
      delete: source?.users?.delete ?? false,
      suspend: source?.users?.suspend ?? false,
      ban: source?.users?.ban ?? false,
    },
    business: {
      create: source?.business?.create ?? false,
      manage: source?.business?.manage ?? false,
      approve: source?.business?.approve ?? false,
      deny: source?.business?.deny ?? false,
    },
    events: {
      update: source?.events?.update ?? false,
      approve: source?.events?.approve ?? false,
      deny: source?.events?.deny ?? false,
    },
    services: {
      view: source?.services?.view ?? false,
      approve: source?.services?.approve ?? false,
      deny: source?.services?.deny ?? false,
    },
  };
};

const SubAdminCard = ({ subAdmin, onDelete, onSettingsClick }) => {
  return (
    <div className="sub-admin-card">
      <img src={subAdmin.photo} alt={subAdmin.name} className="sub-admin-photo" />
      <div className="sub-admin-info">
        <h3>{subAdmin.name}</h3>
        <p>ID: {subAdmin.id}</p>
      </div>
      <div className="sub-admin-actions">
        <FaCog className="settings-icon" onClick={() => onSettingsClick(subAdmin.id)} />
        <button className="delete-btn" onClick={() => onDelete(subAdmin.id)}>Delete</button>
      </div>
    </div>
  );
};

const SubAdminPage = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubAdminId, setSelectedSubAdminId] = useState(null);
  const [permissions, setPermissions] = useState(defaultPermissions);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchSubAdmins = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE}/getSubAdmins.php`);
        const data = await response.json();
        if (data.success && data.subadmins) {
          setSubAdmins(data.subadmins);
        }
      } catch (error) {
        console.error("Error fetching sub-admins:", error);
      }
    };
    fetchSubAdmins();
  }, []);

  const handleDeleteSubAdmin = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/deleteSubAdmins.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subAdminID: id }),
      });
      const data = await res.json();
      if (data.success) {
        setSubAdmins((prev) => prev.filter((sa) => sa.id !== id));
        setSnackbarMessage("Sub-admin deleted successfully");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error deleting sub-admin:", error);
    }
  };

  const handleSettingsClick = (id) => {
    setSelectedSubAdminId(id);
    const found = subAdmins.find((sa) => sa.id === id);
    if (found && found.permissions) {
      setPermissions(ensurePermissions(found.permissions));
    } else {
      setPermissions(defaultPermissions);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSubAdminId(null);
  };

  const handlePermissionChange = (category, permission) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: !prev[category][permission],
      },
    }));
  };

  const handleSavePermissions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE}/updateSubAdminPermissions.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subAdminID: selectedSubAdminId,
          permissions,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSubAdmins((prev) =>
          prev.map((sa) =>
            sa.id === selectedSubAdminId
              ? { ...sa, permissions }
              : sa
          )
        );
        setSnackbarMessage("Permissions updated successfully");
        setSnackbarOpen(true);
        closeModal();
      }
    } catch (error) {
      console.error("Error updating permissions:", error);
    }
  };

  return (
    <div className="sub-admin-page">
      {subAdmins.map((subAdmin) => (
        <SubAdminCard
          key={subAdmin.id}
          subAdmin={subAdmin}
          onDelete={handleDeleteSubAdmin}
          onSettingsClick={handleSettingsClick}
        />
      ))}

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Manage Permissions for Sub-Admin {selectedSubAdminId}</h2>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>

            <div className="permission-category">
              <h3>Users</h3>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.users.update}
                  onChange={() => handlePermissionChange("users", "update")}
                />
                View Users
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.users.delete}
                  onChange={() => handlePermissionChange("users", "delete")}
                />
                Delete Users
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.users.suspend}
                  onChange={() => handlePermissionChange("users", "suspend")}
                />
                Suspend Users
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.users.ban}
                  onChange={() => handlePermissionChange("users", "ban")}
                />
                Ban Users
              </label>
            </div>

            <div className="permission-category">
              <h3>Business</h3>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.business.manage}
                  onChange={() => handlePermissionChange("business", "manage")}
                />
                View Business
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.business.approve}
                  onChange={() => handlePermissionChange("business", "approve")}
                />
                Approve Business
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.business.deny}
                  onChange={() => handlePermissionChange("business", "deny")}
                />
                Deny Business
              </label>
            </div>

            <div className="permission-category">
              <h3>Events</h3>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.events.update}
                  onChange={() => handlePermissionChange("events", "update")}
                />
                View Events
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.events.approve}
                  onChange={() => handlePermissionChange("events", "approve")}
                />
                Approve Events
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.events.deny}
                  onChange={() => handlePermissionChange("events", "deny")}
                />
                Deny Events
              </label>
            </div>

            <div className="permission-category">
              <h3>Services</h3>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.services.view}
                  onChange={() => handlePermissionChange("services", "view")}
                />
                View Services
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.services.approve}
                  onChange={() => handlePermissionChange("services", "approve")}
                />
                Approve Services
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={permissions.services.deny}
                  onChange={() => handlePermissionChange("services", "deny")}
                />
                Deny Services
              </label>
            </div>

            <button className="modal-save" onClick={handleSavePermissions}>
              Save Changes
            </button>
          </div>
        </div>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SubAdminPage;
