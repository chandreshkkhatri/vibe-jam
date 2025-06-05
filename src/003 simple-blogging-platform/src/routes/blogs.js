const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../config/database");
const { authMiddleware, ownershipMiddleware } = require("../middleware/auth");

const router = express.Router();

// List all blog entries
router.get("/", (req, res) => {
  const query = `
    SELECT be.*, u.email as author_email,
      (SELECT COUNT(*) FROM likes WHERE blog_entry_id = be.id) as likes_count
    FROM blog_entries be
    JOIN users u ON be.author_id = u.id
    ORDER BY be.created_at DESC`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

// Get single blog entry
router.get("/:id", (req, res) => {
  const query = `
    SELECT be.*, u.email as author_email,
      (SELECT COUNT(*) FROM likes WHERE blog_entry_id = be.id) as likes_count
    FROM blog_entries be
    JOIN users u ON be.author_id = u.id
    WHERE be.id = ?`;
  db.get(query, [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!row) return res.status(404).json({ error: "Blog entry not found" });
    res.json(row);
  });
});

// Create blog entry
router.post(
  "/",
  authMiddleware,
  [body("title").notEmpty(), body("content").notEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { title, content } = req.body;
    const author_id = req.user.id;
    db.run(
      "INSERT INTO blog_entries (title, content, author_id) VALUES (?, ?, ?)",
      [title, content, author_id],
      function (err) {
        if (err)
          return res.status(500).json({ error: "Failed to create blog entry" });
        res.status(201).json({ id: this.lastID, title, content, author_id });
      }
    );
  }
);

// Update blog entry
router.put(
  "/:id",
  authMiddleware,
  ownershipMiddleware("blog"),
  [body("title").optional().notEmpty(), body("content").optional().notEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { title, content } = req.body;
    const updates = [];
    const params = [];
    if (title) {
      updates.push("title = ?");
      params.push(title);
    }
    if (content) {
      updates.push("content = ?");
      params.push(content);
    }
    if (updates.length === 0)
      return res.status(400).json({ error: "No fields to update" });
    params.push(req.params.id);
    db.run(
      `UPDATE blog_entries SET ${updates.join(
        ", "
      )}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      params,
      function (err) {
        if (err)
          return res.status(500).json({ error: "Failed to update blog entry" });
        res.json({ message: "Blog entry updated" });
      }
    );
  }
);

// Delete blog entry
router.delete(
  "/:id",
  authMiddleware,
  ownershipMiddleware("blog"),
  (req, res) => {
    db.run(
      "DELETE FROM blog_entries WHERE id = ?",
      [req.params.id],
      function (err) {
        if (err)
          return res.status(500).json({ error: "Failed to delete blog entry" });
        res.json({ message: "Blog entry deleted" });
      }
    );
  }
);

module.exports = router;
