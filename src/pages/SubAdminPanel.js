import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CssBaseline,
  Toolbar,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  MdHome,
  MdPeople,
  MdBusiness,
  MdEvent,
  MdBuild,
  MdReport,
  MdLogout,
} from "react-icons/md";
import HomePage from "./HomePage";
import ReportPage from "./ReportPage";
import StyledTable from "./StyledTable";
import "./AdminPanel.css";

const INACTIVITY_LIMIT = 300000;

const SubAdminPanel = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activePage, setActivePage] = useState(() => {
    const storedPage = localStorage.getItem("subAdminActivePage");
    return storedPage || "home";
  });
  const [admin, setAdmin] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [inactivityTimer, setInactivityTimer] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin");
    if (!stored) {
      window.location.href = "/x123y-login";
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.adminID && parsed.role === "subadmin") {
        setAdmin(parsed);
      } else {
        window.location.href = "/x123y-login";
        return;
      }
    } catch {
      window.location.href = "/x123y-login";
      return;
    }
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      const timer = setTimeout(() => {
        localStorage.removeItem("admin");
        localStorage.removeItem("subAdminActivePage");
        window.location.href = "/x123y-login";
      }, INACTIVITY_LIMIT);
      setInactivityTimer(timer);
    };

    const activityEvents = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [inactivityTimer]);

  useEffect(() => {
    localStorage.setItem("subAdminActivePage", activePage);
  }, [activePage]);

  const updatePermissions = async () => {
    if (admin && admin.role === "subadmin") {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/getSingleAdmin.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ adminID: admin.adminID }),
        }
      );
      const data = await res.json();
      if (data.success && data.permissions) {
        setAdmin((prev) => {
          const updated = { ...prev, permissions: data.permissions };
          localStorage.setItem("admin", JSON.stringify(updated));
          return updated;
        });
      }
    }
  };

  useEffect(() => {
    if (!checkingAuth) {
      updatePermissions();
      if (activePage === "users") fetchUsers();
      if (activePage === "businesses") fetchBusinesses();
      if (activePage === "events") fetchEvents();
      if (activePage === "services") fetchServices();
    }
  }, [activePage, checkingAuth]);

  useEffect(() => {
    const interval = setInterval(updatePermissions, 3000);
    return () => clearInterval(interval);
  }, [admin]);

  const hasPermission = (category, perm) => {
    return (
      admin?.permissions &&
      admin.permissions[category] &&
      admin.permissions[category][perm] === true
    );
  };

  const notify = (msg) => {
    setSnackbarMessage(msg);
    setOpenSnackbar(true);
  };

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("subAdminActivePage");
    window.location.href = "/x123y-login";
  };

  const fetchBusinesses = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE}/businesses.php`);
    const data = await res.json();
    if (data.success) {
      setBusinesses(data.data.filter((b) => b.status !== "approved"));
    }
  };

  const fetchEvents = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE}/events.php`);
    const data = await res.json();
    if (data.success) {
      setEvents(data.data.filter((e) => e.status !== "Approved"));
    }
  };

  const fetchUsers = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE}/users.php`);
    const data = await res.json();
    if (data.success) {
      setUsers(data.data);
    }
  };

  const fetchServices = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_BASE}/services.php`);
    const data = await res.json();
    if (data.success) {
      setServices(data.data.filter((s) => s.status !== "approved"));
    }
  };

  const handleUserAction = async (action, userID) => {
    if (
      !hasPermission("users", "update") &&
      !hasPermission("users", "delete")
    ) {
      notify("Not authorized.");
      return;
    }
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE}/userAction.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, userID }),
      }
    );
    const data = await res.json();
    notify(data.success ? `${action} successful.` : `${action} failed.`);
    if (data.success) {
      fetchUsers();
    }
  };

  const handleApproveDeny = async (type, id, action) => {
    let permCategory = "";
    if (type === "owner") permCategory = "business";
    if (type === "event") permCategory = "events";
    if (type === "service") permCategory = "services";

    if (
      !permCategory ||
      (!hasPermission(permCategory, "manage") &&
        !hasPermission(permCategory, "create"))
    ) {
      notify("Not authorized.");
      return;
    }
    const endpoint = action === "approve" ? "approveAll.php" : "denyAll.php";
    const res = await fetch(`https://getbizlinker.site/backend/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [`${type}ID`]: id }),
    });
    const response = await res.json();
    if (response.success) {
      notify(`${type} ${action}d successfully.`);
      if (type === "owner") fetchBusinesses();
      if (type === "event") fetchEvents();
      if (type === "service") fetchServices();
    } else {
      notify(`${type} ${action} failed.`);
    }
  };

  const renderPageContent = () => {
    if (checkingAuth) {
      return (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      );
    }
    switch (activePage) {
      case "home":
        return <HomePage />;
      case "users":
        if (
          !hasPermission("users", "update") &&
          !hasPermission("users", "delete")
        ) {
          return <Typography variant="h5">Not Authorized</Typography>;
        }
        return (
          <Box className="users-container">
            <Typography variant="h5" className="page-title">
              Registered Users ({users.length})
            </Typography>
            <br />
            <br />
            <StyledTable
              columns={["ID", "First Name", "Last Name", "Email"]}
              data={users.map((u) => ({
                id: u.userID,
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
              }))}
              actions={(u) => (
                <>
                  {hasPermission("users", "update") && (
                    <>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#FF5900",
                          marginRight: "5px",
                        }}
                        onClick={() => handleUserAction("Suspend", u.id)}
                      >
                        Suspend
                      </Button>
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#1876D2",
                          marginRight: "5px",
                        }}
                        onClick={() => handleUserAction("Ban", u.id)}
                      >
                        Ban
                      </Button>
                    </>
                  )}
                  {hasPermission("users", "delete") && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleUserAction("Delete", u.id)}
                    >
                      Delete
                    </Button>
                  )}
                </>
              )}
            />
          </Box>
        );
      case "businesses":
        if (
          !hasPermission("business", "create") &&
          !hasPermission("business", "manage")
        ) {
          return <Typography variant="h5">Not Authorized</Typography>;
        }
        return (
          <Box className="businesses-container">
            <Typography variant="h5" className="page-title">
              Business Requests ({businesses.length})
            </Typography>
            <br />
            <br />
            <StyledTable
              columns={["ID", "Business Name", "Category", "Location"]}
              data={businesses.map((b) => ({
                id: b.ownerID,
                name: b.businessName,
                category: b.category,
                location: b.location,
              }))}
              actions={(b) => (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApproveDeny("owner", b.id, "approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    style={{ marginLeft: "5px" }}
                    onClick={() => handleApproveDeny("owner", b.id, "deny")}
                  >
                    Deny
                  </Button>
                </>
              )}
            />
          </Box>
        );
      case "events":
        if (
          !hasPermission("events", "update") &&
          !hasPermission("events", "delete")
        ) {
          return <Typography variant="h5">Not Authorized</Typography>;
        }
        return (
          <Box className="event-requests">
            <Typography variant="h5" className="page-title">
              Event Requests ({events.length})
            </Typography>
            <br />
            <br />
            <StyledTable
              columns={["ID", "Event Name", "Organizer", "Date", "Location"]}
              data={events.map((e) => ({
                id: e.eventID,
                name: e.eventName,
                organizer: e.organizerName,
                date: e.eventDate,
                location: e.location,
              }))}
              actions={(ev) => (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleApproveDeny("event", ev.id, "approve")}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    style={{ marginLeft: "5px" }}
                    onClick={() => handleApproveDeny("event", ev.id, "deny")}
                  >
                    Deny
                  </Button>
                </>
              )}
            />
          </Box>
        );
      case "services":
        if (
          !hasPermission("services", "view") &&
          !hasPermission("services", "manage")
        ) {
          return <Typography variant="h5">Not Authorized</Typography>;
        }
        return (
          <Box className="service-requests">
            <Typography variant="h5" className="page-title">
              Service Requests ({services.length})
            </Typography>
            <br />
            <br />
            <StyledTable
              columns={["ID", "Service Name", "Provider", "Category", "Price"]}
              data={services.map((s) => ({
                id: s.serviceID,
                name: s.serviceName,
                provider: s.providerName,
                category: s.category,
                price: `$${s.price}`,
              }))}
              actions={(sv) => (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      handleApproveDeny("service", sv.id, "approve")
                    }
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    style={{ marginLeft: "5px" }}
                    onClick={() => handleApproveDeny("service", sv.id, "deny")}
                  >
                    Deny
                  </Button>
                </>
              )}
            />
          </Box>
        );
      case "reports":
        return <ReportPage admin={admin} />;
      default:
        return <Typography>Page Not Found</Typography>;
    }
  };

  return (
    <Box className="admin-panel-container">
      <CssBaseline />
      <Drawer variant="permanent" className="admin-drawer">
        <Toolbar />
        <List>
          <ListItem button onClick={() => setActivePage("home")}>
            <ListItemIcon>
              <MdHome size={24} />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          {(hasPermission("users", "update") ||
            hasPermission("users", "delete")) && (
            <ListItem button onClick={() => setActivePage("users")}>
              <ListItemIcon>
                <MdPeople size={24} />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItem>
          )}
          {(hasPermission("business", "create") ||
            hasPermission("business", "manage")) && (
            <ListItem button onClick={() => setActivePage("businesses")}>
              <ListItemIcon>
                <MdBusiness size={24} />
              </ListItemIcon>
              <ListItemText primary="Businesses" />
            </ListItem>
          )}
          {(hasPermission("events", "update") ||
            hasPermission("events", "delete")) && (
            <ListItem button onClick={() => setActivePage("events")}>
              <ListItemIcon>
                <MdEvent size={24} />
              </ListItemIcon>
              <ListItemText primary="Events" />
            </ListItem>
          )}
          {(hasPermission("services", "view") ||
            hasPermission("services", "manage")) && (
            <ListItem button onClick={() => setActivePage("services")}>
              <ListItemIcon>
                <MdBuild size={24} />
              </ListItemIcon>
              <ListItemText primary="Services" />
            </ListItem>
          )}
          <ListItem button onClick={() => setActivePage("reports")}>
            <ListItemIcon>
              <MdReport size={24} />
            </ListItemIcon>
            <ListItemText primary="Reports" />
          </ListItem>
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <MdLogout size={24} />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" className="admin-content">
        <Toolbar />
        {renderPageContent()}
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SubAdminPanel;
