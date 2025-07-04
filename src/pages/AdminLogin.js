import { useState } from "react";
import { TextField, Button, Card, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE}/adminLogin.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );
    const data = await response.json();
    if (data.success) {
      localStorage.setItem(
        "admin",
        JSON.stringify({
          adminID: data.adminID,
          role: data.role,
          name: data.name,
          token: data.token,
        })
      );
      if (data.role === "admin") {
        navigate("/admin");
      } else if (data.role === "subadmin") {
        const permissionsRes = await fetch(
          `${process.env.REACT_APP_API_BASE}/getSingleAdmin.php`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ adminID: data.adminID }),
          }
        );
        const permissionsData = await permissionsRes.json();
        if (permissionsData.success && permissionsData.permissions) {
          const updated = JSON.parse(localStorage.getItem("admin"));
          updated.permissions = permissionsData.permissions;
          localStorage.setItem("admin", JSON.stringify(updated));
        }
        navigate("/sub-admin");
      }
    } else {
      toast.error(data.message || "Invalid login");
    }
  };

  return (
    <div className="admin-container">
      <Card className="admin-card">
        <Typography variant="h5" className="admin-title">
          Admin Panel Login
        </Typography>
        <form onSubmit={handleLogin} className="admin-form">
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="login-button"
          >
            Login
          </Button>
        </form>
      </Card>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AdminLogin;
