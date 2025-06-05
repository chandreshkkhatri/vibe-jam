const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const db = require("../config/database");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "dev_secret";

// Register
router.post(
  "/register",
  [body("email").isEmail(), body("password").isLength({ min: 6 })],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const password_hash = bcrypt.hashSync(password, 10);
    db.run(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, password_hash],
      function (err) {
        if (err) {
          return res.status(400).json({ error: "Email already in use" });
        }
        const user = { id: this.lastID, email };
        const token = jwt.sign(user, SECRET, { expiresIn: "7d" });
        res.status(201).json({ user, token });
      }
    );
  }
);

// Login
router.post(
  "/login",
  [body("email").isEmail(), body("password").exists()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
      if (err || !user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      if (!bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
        expiresIn: "7d",
      });
      res.json({ user: { id: user.id, email: user.email }, token });
    });
  }
);

module.exports = router;
