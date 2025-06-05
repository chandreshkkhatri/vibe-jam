require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const db = require("./src/config/database");
const authRoutes = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blogs");
const likeRoutes = require("./src/routes/likes");
const commentRoutes = require("./src/routes/comments");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use("/auth", authRoutes);
app.use("/comments", commentRoutes); // for /comments/:id delete
app.use("/blogs", blogRoutes);
app.use("/blogs", likeRoutes);
app.use("/blogs", commentRoutes); // for /blogs/:id/comments

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
