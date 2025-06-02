const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = "./db.json";

app.use(express.json());

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Get all todos (with optional filters)
app.get("/todos", (req, res) => {
  let { status, priority, tags, sortBy } = req.query;
  let { todos } = readDB();
  if (status) todos = todos.filter((t) => t.status === status);
  if (priority) todos = todos.filter((t) => t.priority === priority);
  if (tags) {
    const tagArr = tags.split(",");
    todos = todos.filter(
      (t) => t.tags && tagArr.every((tag) => t.tags.includes(tag))
    );
  }
  if (sortBy === "due_date")
    todos.sort((a, b) => (a.due_date || "").localeCompare(b.due_date || ""));
  if (sortBy === "priority")
    todos.sort((a, b) => (a.priority || "").localeCompare(b.priority || ""));
  res.json(todos);
});

// Get a single todo
app.get("/todos/:id", (req, res) => {
  const { todos } = readDB();
  const todo = todos.find((t) => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: "Not found" });
  res.json(todo);
});

// Create a new todo
app.post("/todos", (req, res) => {
  const {
    title,
    description,
    due_date,
    priority = "medium",
    tags = [],
  } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  const newTodo = {
    id: uuidv4(),
    title,
    description,
    status: "pending",
    due_date,
    priority,
    tags,
  };
  const db = readDB();
  db.todos.push(newTodo);
  writeDB(db);
  res.status(201).json(newTodo);
});

// Update a todo
app.put("/todos/:id", (req, res) => {
  const db = readDB();
  const idx = db.todos.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  db.todos[idx] = { ...db.todos[idx], ...req.body };
  writeDB(db);
  res.json(db.todos[idx]);
});

// Delete a todo
app.delete("/todos/:id", (req, res) => {
  const db = readDB();
  const idx = db.todos.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const removed = db.todos.splice(idx, 1);
  writeDB(db);
  res.json(removed[0]);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
