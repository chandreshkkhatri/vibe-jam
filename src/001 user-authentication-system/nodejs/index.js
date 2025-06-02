require("dotenv").config();

// determine test mode
const isTest = process.env.NODE_ENV === "test";

// Config constants
const SALT_ROUNDS = isTest ? 1 : parseInt(process.env.SALT_ROUNDS, 10) || 10;
const PEPPER = isTest ? "" : process.env.PEPPER || "";
const JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "test_refresh_token_secret";

// Module imports
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Joi = require("joi");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./openapi.yaml");

// validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).max(128).required(),
});
const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});
const refreshSchema = Joi.object({ token: Joi.string().required() });

// validation middleware
function validateSchema(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    next();
  };
}

const app = express();
const port = 8000;

app.use(express.json());

// initialize SQLite database and create users table
const dbSource = process.env.NODE_ENV === "test" ? ":memory:" : "./auth.db";
const db = new sqlite3.Database(dbSource, (err) => {
  if (err) console.error("Failed to connect to DB:", err);
});
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

const refreshTokens = []; // store valid refresh tokens

// user registration
app.post("/register", validateSchema(registerSchema), async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "Username and password required" });
  try {
    const hash = await bcrypt.hash(password + PEPPER, SALT_ROUNDS);
    db.run(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hash],
      function (err) {
        if (err) return res.status(500).json({ error: "User creation failed" });
        res.status(201).json({ message: "User registered" });
      }
    );
  } catch {
    res.status(500).json({ error: "Internal error" });
  }
});

// user login
app.post("/login", validateSchema(loginSchema), async (req, res) => {
  const { username, password } = req.body;
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [username],
    async (err, user) => {
      if (err || !user)
        return res.status(400).json({ error: "Invalid credentials" });
      const match = await bcrypt.compare(password + PEPPER, user.password);
      if (!match) return res.status(400).json({ error: "Invalid credentials" });
      const accessToken = jwt.sign({ id: user.id, username }, JWT_SECRET, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(
        { id: user.id, username },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );
      refreshTokens.push(refreshToken);
      res.json({ accessToken, refreshToken });
    }
  );
});

// refresh token endpoint
app.post("/refresh", validateSchema(refreshSchema), (req, res) => {
  const { token } = req.body;
  if (!refreshTokens.includes(token)) return res.sendStatus(403);
  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "1h",
        jwtid: crypto.randomBytes(16).toString("hex"),
      }
    );
    res.json({ accessToken });
  });
});

// authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// protected profile route
app.get("/profile", authenticateToken, (req, res) => {
  db.get(
    "SELECT id, username FROM users WHERE id = ?",
    [req.user.id],
    (err, user) => {
      if (err || !user) return res.sendStatus(404);
      res.json({ user });
    }
  );
});

// only start server if file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports = app; // export for testing
