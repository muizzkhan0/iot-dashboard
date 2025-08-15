export const toCSV = (mapObj) => {
  // mapObj: { [deviceId]: [{ts,temperature,battery,status}] }
  const rows = [["deviceId", "ts", "temperature", "battery", "status"]];
  for (const [deviceId, arr] of Object.entries(mapObj)) {
    for (const r of arr)
      rows.push([deviceId, r.ts, r.temperature, r.battery, r.status]);
  }
  return rows.map((r) => r.join(",")).join("\n");
};
