// src/pages/Dashboard.jsx
import { useEffect, useRef, useState } from "react";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import { MetricChart } from "../components/Charts";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [series, setSeries] = useState({});
  const wsRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get("/devices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDevices(data.devices);
      const hist = await api.get("/history");
      setSeries(hist.data);
    };
    load();
  }, []);

  useEffect(() => {
    if (!token) return;
    const ws = new WebSocket(`ws://localhost:4000/ws?token=${token}`);
    wsRef.current = ws;
    ws.onmessage = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.type === "reading") {
        setSeries((prev) => {
          const next = { ...prev };
          for (const u of msg.updates) {
            const arr = (next[u.deviceId] || []).slice(-7200);
            next[u.deviceId] = [...arr, u.data];
          }
          return next;
        });
      }
    };
    //return () => ws.close();
  }, [token]);

  const exportCSV = async () => {
    const res = await fetch("http://localhost:4000/api/export/csv", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: "report.csv",
    });
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-in">
      <h2>IoT Device Monitor</h2>
      <p className="subtle">
        Signed in as <b>{user?.email}</b> · role: <b>{user?.role}</b>
      </p>

      <div className="toolbar">
        <button className="button" onClick={exportCSV}>
          Export CSV (24h)
        </button>
      </div>

      <div className="grid">
        {devices.map((d) => {
          const data = series[d.id] || [];
          const last = data[data.length - 1];
          const badgeClass = `badge ${last?.status === "WARN" ? "warn" : "ok"}`;
          return (
            <section key={d.id} className="card grid-col-12">
              <div className="card-header">
                <div className="card-title">{d.name}</div>
                <div className="subtle">@ {d.location}</div>
              </div>

              <div className="kv">
                <div className={badgeClass}>
                  <span className="badge-dot" />
                  <span>Status: {last?.status || "…"}</span>
                </div>
                <div>
                  <span>Temp</span>
                  <span className="value">{last?.temperature ?? "--"} °C</span>
                </div>
                <div>
                  <span>Battery</span>
                  <span className="value">{last?.battery ?? "--"}%</span>
                </div>
              </div>

              <div className="stack mt-12">
                <div className="chart">
                  <MetricChart
                    data={data}
                    metric="temperature"
                    label="Temperature (°C)"
                  />
                </div>
                <div className="chart">
                  <MetricChart
                    data={data}
                    metric="battery"
                    label="Battery (%)"
                  />
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
