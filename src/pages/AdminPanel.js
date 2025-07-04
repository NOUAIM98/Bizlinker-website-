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
  CircularProgress,
} from "@mui/material";
import {
  MdHome,
  MdPeople,
  MdBusiness,
  MdEvent,
  MdBuild,
  MdReport,
  MdAdminPanelSettings,
  MdLogout,
} from "react-icons/md";
import HomePage from "./HomePage";
import SubAdminPage from "./SubAdminPage";
import ReportPage from "./ReportPage";
import StyledTable from "./StyledTable";
import "./AdminPanel.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const INACTIVITY_LIMIT = 300000;

const AdminPanel = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [activePage, setActivePage] = useState(() => {
    const storedPage = localStorage.getItem("adminActivePage");
    return storedPage || "home";
  });
  const [admin, setAdmin] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [inactivityTimer, setInactivityTimer] = useState(null);
const [approvedServices, setApprovedServices] = useState([]);
const [approvedBusinesses, setApprovedBusinesses] = useState([]);
const [approvedEvents, setApprovedEvents] = useState([]);

const fetchApprovedServices = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_BASE}/services.php`);
  const data = await res.json();
  if (data.success) {
    setApprovedServices(data.data.filter((s) => s.status === "approved"));
  }
};
const fetchApprovedBusinesses = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_BASE}/businesses.php`);
  const data = await res.json();
  if (data.success) {
    setApprovedBusinesses(data.data.filter((b) => b.status === "approved"));
  }
};

const fetchApprovedEvents = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_BASE}/events.php`);
  const data = await res.json();
  if (data.success) {
    setApprovedEvents(data.data.filter((e) => e.status === "Approved"));
  }
};

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (!storedAdmin) {
      window.location.href = "/x123y-login";
      return;
    }
    try {
      const parsed = JSON.parse(storedAdmin);
      if (parsed && parsed.adminID) {
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
        localStorage.removeItem("adminActivePage");
        window.location.href = "/x123y-login";
      }, INACTIVITY_LIMIT);
      setInactivityTimer(timer);
    };
const fetchApprovedServices = async () => {
  const res = await fetch(`${process.env.REACT_APP_API_BASE}/services.php`);
  const data = await res.json();
  if (data.success) {
    setApprovedServices(data.data.filter((s) => s.status === "approved"));
  }
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
    localStorage.setItem("adminActivePage", activePage);
  }, [activePage]);

  const logout = async () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminActivePage");
    window.location.href = "/x123y-login";
  };

  const fetchData = {
    businesses: async () => {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/businesses.php`
      );
      const data = await res.json();
      if (data.success) {
        setBusinesses(data.data.filter((b) => b.status !== "approved"));
      }
    },
    events: async () => {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/events.php`);
      const data = await res.json();
      if (data.success) {
        setEvents(data.data.filter((e) => e.status !== "Approved"));
      }
    },
    users: async () => {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/users.php`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      }
    },
    services: async () => {
      const res = await fetch(`${process.env.REACT_APP_API_BASE}/services.php`);
      const data = await res.json();
      if (data.success) {
        setServices(data.data.filter((s) => s.status !== "approved"));
      }
    },
  };

  useEffect(() => {
    if (!checkingAuth && fetchData[activePage]) {
      fetchData[activePage]();
    }
  }, [activePage, checkingAuth]);

  const notify = (msg, type = "success") => {
    toast[type](msg);
  };
  const handleUserAction = async (action, userID) => {
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
      fetchData.users();
    }
  };

  const handleApproveDeny = async (type, id, action) => {
    const endpoint = action === "approve" ? "approveAll.php" : "denyAll.php";
    const res = await fetch(`${process.env.REACT_APP_API_BASE}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [`${type}ID`]: id }),
    });
    const data = await res.json();
    if (data.success) {
      notify(
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } ${action}d successfully.`
      );
      if (type === "owner") {
        fetchData.businesses();
      } else {
        fetchData[type + "s"]();
      }
    } else {
      notify(
        `${type.charAt(0).toUpperCase() + type.slice(1)} ${action} failed.`
      );
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
        return (
          <Box className="users-container">
            <Typography variant="h5" className="page-title">
              Registered Users ({users.length})
            </Typography>
            <br />
            <br />
            <StyledTable
              columns={["ID", "First Name", "Last Name", "Email"]}
              data={users.map((user) => ({
                id: user.userID,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
              }))}
              actions={(u) => (
                <>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#FF5900" }}
                    onClick={() => handleUserAction("Suspend", u.id)}
                  >
                    Suspend
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "#1876D2", ml: 1 }}
                    onClick={() => handleUserAction("Ban", u.id)}
                  >
                    Ban
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ ml: 1 }}
                    onClick={() => handleUserAction("Delete", u.id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            />
          </Box>
        );
case "businesses":
  return (
    <Box>
      <Typography variant="h5" className="page-title">
        Business Requests ({businesses.length})
      </Typography>
      <br />
      <Button
        variant="outlined"
        sx={{
          borderColor: "#1876D2",
          color: "#1876D2",
          fontWeight: "bold",
          padding: "8px 20px",
          borderRadius: "8px",
          textTransform: "none",
          '&:hover': {
            backgroundColor: "#E3F2FD",
            borderColor: "#1565C0",
          },
        }}
        onClick={() => {
          setActivePage("approvedBusinesses");
          fetchApprovedBusinesses();
        }}
      >
        See All Approved Businesses
      </Button>
      <br />
      <br />
      <StyledTable
        columns={[
          "ID",
          "Picture",
          "Business Name",
          "Category",
          "Location",
          "Created At",
        ]}
        data={businesses.map((b) => ({
          id: b.ownerID,
          picture: (
            <img
              src={`${process.env.REACT_APP_API_BASE}/${b.photos}`}
              alt="Business"
              style={{ width: 50, height: 50, borderRadius: 8 }}
            />
          ),
          name: b.businessName,
          category: b.category,
          location: b.location,
          createdAt: b.created_at,
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
              sx={{ ml: 1 }}
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
  return (
    <Box>
      <Typography variant="h5" className="page-title">
        Event Requests ({events.length})
      </Typography>
      <br />
      <Button
        variant="outlined"
        sx={{
          borderColor: "#1876D2",
          color: "#1876D2",
          fontWeight: "bold",
          padding: "8px 20px",
          borderRadius: "8px",
          textTransform: "none",
          '&:hover': {
            backgroundColor: "#E3F2FD",
            borderColor: "#1565C0",
          },
        }}
        onClick={() => {
          setActivePage("approvedEvents");
          fetchApprovedEvents();
        }}
      >
        See All Approved Events
      </Button>
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
              sx={{ ml: 1 }}
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
  return (
    <Box>
      <Typography variant="h5" className="page-title">
        Service Requests ({services.length})
      </Typography>
      <br />
      {/* Yeni Buton */}
  <Button
  variant="outlined"
  sx={{
    borderColor: "#1876D2",
    color: "#1876D2",
    fontWeight: "bold",
    padding: "8px 20px",
    borderRadius: "8px",
    textTransform: "none",
    '&:hover': {
      backgroundColor: "#E3F2FD",
      borderColor: "#1565C0",
    },
  }}
  onClick={() => {
    setActivePage("approvedServices");
    fetchApprovedServices();
  }}
>
  See All Approved Services
</Button>

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
              sx={{ ml: 1 }}
              onClick={() => handleApproveDeny("service", sv.id, "deny")}
            >
              Deny
            </Button>
          </>
        )}
      />
    </Box>
  );

      case "subadmin":
        return <SubAdminPage />;
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
          {[
            { key: "home", label: "Home", icon: <MdHome /> },
            { key: "users", label: "Users", icon: <MdPeople /> },
            { key: "businesses", label: "Businesses", icon: <MdBusiness /> },
            { key: "events", label: "Events", icon: <MdEvent /> },
            { key: "services", label: "Services", icon: <MdBuild /> },
            { key: "reports", label: "Reports", icon: <MdReport /> },
            {
              key: "subadmin",
              label: "Sub-Admins",
              icon: <MdAdminPanelSettings />,
            },
          ].map(({ key, label, icon }) => (
            <ListItem button key={key} onClick={() => setActivePage(key)}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItem>
          ))}
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <MdLogout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
      <Box component="main" className="admin-content">
        <Toolbar />
        {renderPageContent()}
      </Box>
      <ToastContainer position="top-center" autoClose={3000} />
    </Box>
  );
};

export default AdminPanel;
