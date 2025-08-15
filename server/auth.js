import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const signJWT = (user, secret) =>
  jwt.sign({ sub: user.id, role: user.role, email: user.email }, secret, {
    expiresIn: "2h",
  });

export const requireAuth = (secret) => (req, res, next) => {
  const hdr = req.headers.authorization || "";
  const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    req.user = jwt.verify(token, secret);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const requireRole = (role) => (req, res, next) =>
  req.user?.role === role
    ? next()
    : res.status(403).json({ error: "Forbidden" });

// for demo only — you'd use a DB
export const hash = (pw) => bcrypt.hashSync(pw, 10);
export const verify = (pw, hash) => bcrypt.compareSync(pw, hash);
