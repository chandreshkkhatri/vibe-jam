const jwt = require("jsonwebtoken");
const db = require("../config/database");
const SECRET = process.env.JWT_SECRET || "dev_secret";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Missing token" });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// Checks if the user owns the resource (blog or comment)
function ownershipMiddleware(type) {
  return (req, res, next) => {
    const userId = req.user.id;
    let table, idField;
    if (type === "blog") {
      table = "blog_entries";
      idField = "id";
    } else if (type === "comment") {
      table = "comments";
      idField = "id";
    } else {
      return res.status(500).json({ error: "Invalid ownership type" });
    }
    const id = req.params.id;
    db.get(
      `SELECT author_id FROM ${table} WHERE ${idField} = ?`,
      [id],
      (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!row) return res.status(404).json({ error: `${type} not found` });
        if (row.author_id !== userId)
          return res.status(403).json({ error: "Forbidden" });
        next();
      }
    );
  };
}

module.exports = { authMiddleware, ownershipMiddleware };
