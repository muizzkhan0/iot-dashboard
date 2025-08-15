import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

import { users, devices, tick, getRange } from "./data.js";
import { toCSV } from "./export.js";
import { signJWT, requireAuth, requireRole, verify } from "./auth.js";

const app = express();
app.use(cors({ origin: process.env.ORIGIN, credentials: true }));
app.use(express.json());

// --- Auth ---
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  const user = users.find((u) => u.email === email);
  if (!user || !verify(password, user.passwordHash)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = signJWT(user, process.env.JWT_SECRET);
  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

app.get("/api/me", requireAuth(process.env.JWT_SECRET), (req, res) => {
  res.json({ user: req.user });
});

// --- Devices & History ---
app.get("/api/devices", requireAuth(process.env.JWT_SECRET), (req, res) => {
  res.json({ devices });
});

app.get("/api/history", requireAuth(process.env.JWT_SECRET), (req, res) => {
  const { deviceId, from, to } = req.query;
  res.json(getRange({ deviceId, from, to }));
});

app.get("/api/export/csv", requireAuth(process.env.JWT_SECRET), (req, res) => {
  const { deviceId, from, to } = req.query;
  const data = getRange({ deviceId, from, to });
  const csv = toCSV(data);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=report.csv");
  res.send(csv);
});

// --- Example admin only route ---
app.post(
  "/api/admin/devices",
  requireAuth(process.env.JWT_SECRET),
  requireRole("admin"),
  (req, res) => {
    // (stub) create device would go here
    res.json({ ok: true });
  }
);

// --- HTTP + WS server ---
const server = createServer(app);
const wss = new WebSocketServer({ server, path: "/ws" });

// verify token from query (?token=)
wss.on("connection", (ws, req) => {
  const params = new URLSearchParams(req.url.split("?")[1] || "");
  const token = params.get("token");
  try {
    ws.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    ws.close(1008, "Invalid token");
    return;
  }
  ws.send(
    JSON.stringify({
      type: "hello",
      user: { email: ws.user.email, role: ws.user.role },
    })
  );
});

// broadcast ticks every 2s
setInterval(() => {
  const updates = tick(); // [{deviceId,data}]
  const payload = JSON.stringify({ type: "reading", updates });
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(payload);
  }
}, 2000);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
