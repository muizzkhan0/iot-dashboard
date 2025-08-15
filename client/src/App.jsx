// src/App.jsx
import { useAuth } from "./auth/AuthContext";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import { useState } from "react";

export default function App() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");
  if (!user)
    return (
      <div className="center" style={{ minHeight: "100vh" }}>
        <Login />
      </div>
    );

  return (
    <div>
      <header className="nav">
        <div className="container nav-inner">
          <div className="brand">IoT Monitor</div>
          <button
            className={`button ${tab === "dashboard" ? "primary" : "ghost"}`}
            onClick={() => setTab("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={`button ${tab === "admin" ? "primary" : "ghost"}`}
            onClick={() => setTab("admin")}
          >
            Admin
          </button>
          <div className="right" />
          <button className="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      <main className="container page fade-in">
        {tab === "dashboard" ? <Dashboard /> : <Admin />}
      </main>
    </div>
  );
}
