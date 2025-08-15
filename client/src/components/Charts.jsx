// src/components/Charts.jsx
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export function MetricChart({ data, metric, label }) {
  const formatted = data.map((d) => ({
    ...d,
    time: new Date(d.ts).toLocaleTimeString(),
  }));
  return (
    <div>
      <h4 className="subtle" style={{ margin: "4px 0 10px" }}>
        {label}
      </h4>
      <LineChart width={900} height={240} data={formatted}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" minTickGap={20} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={metric} dot={false} />
      </LineChart>
    </div>
  );
}
