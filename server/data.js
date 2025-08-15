import { v4 as uuid } from "uuid";
import { subHours, isAfter } from "date-fns";

export const users = [
  {
    id: "u1",
    email: "admin@example.com",
    passwordHash:
      "$2b$10$R5J5EBthV54lZjhnSIButebd3kRFGMm6a0vlkBij1zGPr4Mec/tz6",
    role: "admin",
  },
  {
    id: "u2",
    email: "user@example.com",
    passwordHash:
      "$2b$10$mnyKsSQvFA.W4QV5FxdoluvPsKNFkATHBk1sLliwVt.X.eCV43W.K",
    role: "user",
  },
];

export const devices = [
  { id: "dev-1", name: "Boiler #1", location: "Plant A" },
  { id: "dev-2", name: "Chiller #3", location: "Plant B" },
  { id: "dev-3", name: "Pump #7", location: "Plant A" },
];

// in-memory 24h history { [deviceId]: Array<{ts, temperature, battery, status}> }
export const history = new Map(devices.map((d) => [d.id, []]));

// keep arrays trimmed to last 24h
const trimOld = (arr) => {
  const cutoff = subHours(new Date(), 24);
  let i = 0;
  while (i < arr.length && !isAfter(new Date(arr[i].ts), cutoff)) i++;
  if (i > 0) arr.splice(0, i);
};

// random-ish stream per device
const state = new Map(
  devices.map((d) => [
    d.id,
    {
      temperature: 60 + Math.random() * 10, // °C
      battery: 50 + Math.random() * 50, // %
      status: "OK",
    },
  ])
);

export const tick = () => {
  const now = Date.now();
  const out = [];
  for (const d of devices) {
    const s = state.get(d.id);
    // random walk
    s.temperature += (Math.random() - 0.5) * 2;
    s.battery = Math.max(0, Math.min(100, s.battery - Math.random() * 0.1));
    // occasional warning
    if (Math.random() < 0.01) s.status = s.status === "OK" ? "WARN" : "OK";

    const sample = {
      ts: now,
      temperature: +s.temperature.toFixed(2),
      battery: +s.battery.toFixed(2),
      status: s.status,
    };
    const arr = history.get(d.id);
    arr.push(sample);
    trimOld(arr);
    out.push({ deviceId: d.id, data: sample });
  }
  return out; // broadcast this
};

export const getRange = ({ deviceId, from, to }) => {
  const start = from ? +from : Date.now() - 24 * 3600 * 1000;
  const end = to ? +to : Date.now();
  const inRange = (x) => x.ts >= start && x.ts <= end;

  if (deviceId)
    return { [deviceId]: (history.get(deviceId) || []).filter(inRange) };
  const result = {};
  for (const d of devices)
    result[d.id] = (history.get(d.id) || []).filter(inRange);
  return result;
};
