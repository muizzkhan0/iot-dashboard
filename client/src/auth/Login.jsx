// src/auth/Login.jsx
import { useState } from "react";
import { useAuth } from "./AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (e) {
      setErr(e.response?.data?.error || "Login failed");
    }
  };

  return (
    <form onSubmit={onSubmit} className="form stack">
      <h2>Sign in</h2>
      <input
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
      />
      <div className="form-actions">
        <button className="button primary" type="submit">
          Sign In
        </button>
        {err && (
          <span className="subtle" style={{ color: "var(--err)" }}>
            {err}
          </span>
        )}
      </div>
      <p className="subtle">
        Try <b>admin@example.com</b> / <b>admin123</b>
        {} or <b>user@example.com</b> / <b>user123</b>
      </p>
    </form>
  );
}
