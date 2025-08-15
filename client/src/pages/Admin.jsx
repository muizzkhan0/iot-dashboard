import { useAuth } from "../auth/AuthContext";
export default function Admin() {
  const { user } = useAuth();
  if (user?.role !== "admin") return <p>Forbidden</p>;
  return (
    <div style={{ padding: 24 }}>
      <h2>Admin</h2>
      <p>Admin-only actions go here.</p>
    </div>
  );
}
