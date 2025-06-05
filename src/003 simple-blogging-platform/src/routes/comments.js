const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../config/database");
const { authMiddleware, ownershipMiddleware } = require("../middleware/auth");

const router = express.Router();

// List comments for a blog entry
router.get("/:id/comments", (req, res) => {
  db.all(
    `SELECT c.*, u.email as author_email FROM comments c JOIN users u ON c.author_id = u.id WHERE c.blog_entry_id = ? ORDER BY c.created_at ASC`,
    [req.params.id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(rows);
    }
  );
});

// Add comment to a blog entry
router.post(
  "/:id/comments",
  authMiddleware,
  [body("content").notEmpty()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    const { content } = req.body;
    const author_id = req.user.id;
    const blog_entry_id = req.params.id;
    db.run(
      "INSERT INTO comments (content, author_id, blog_entry_id) VALUES (?, ?, ?)",
      [content, author_id, blog_entry_id],
      function (err) {
        if (err)
          return res.status(500).json({ error: "Failed to add comment" });
        res
          .status(201)
          .json({ id: this.lastID, content, author_id, blog_entry_id });
      }
    );
  }
);

// Delete comment
router.delete(
  "/:id", // Changed from "/comments/:id"
  authMiddleware,
  ownershipMiddleware("comment"),
  (req, res) => {
    db.run(
      "DELETE FROM comments WHERE id = ?",
      [req.params.id],
      function (err) {
        if (err)
          return res.status(500).json({ error: "Failed to delete comment" });
        res.json({ message: "Comment deleted" });
      }
    );
  }
);

module.exports = router;
