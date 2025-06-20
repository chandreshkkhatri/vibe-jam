const express = require("express");
const db = require("../config/database");
const { authMiddleware } = require("../middleware/auth");

const router = express.Router();

// Like a blog entry
router.post("/:id/like", authMiddleware, (req, res) => {
  const user_id = req.user.id;
  const blog_entry_id = req.params.id;
  db.run(
    "INSERT OR IGNORE INTO likes (user_id, blog_entry_id) VALUES (?, ?)",
    [user_id, blog_entry_id],
    function (err) {
      if (err)
        return res.status(500).json({ error: "Failed to like blog entry" });
      db.get(
        "SELECT COUNT(*) as likes_count FROM likes WHERE blog_entry_id = ?",
        [blog_entry_id],
        (err, row) => {
          if (err) return res.status(500).json({ error: "Database error" });
          res.json({ message: "Liked", likes_count: row.likes_count });
        }
      );
    }
  );
});

// Unlike a blog entry
router.delete("/:id/like", authMiddleware, (req, res) => {
  const user_id = req.user.id;
  const blog_entry_id = req.params.id;
  db.run(
    "DELETE FROM likes WHERE user_id = ? AND blog_entry_id = ?",
    [user_id, blog_entry_id],
    function (err) {
      if (err)
        return res.status(500).json({ error: "Failed to unlike blog entry" });
      db.get(
        "SELECT COUNT(*) as likes_count FROM likes WHERE blog_entry_id = ?",
        [blog_entry_id],
        (err, row) => {
          if (err) return res.status(500).json({ error: "Database error" });
          res.json({ message: "Unliked", likes_count: row.likes_count });
        }
      );
    }
  );
});

module.exports = router;
