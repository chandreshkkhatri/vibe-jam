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

function isValidPriority(priority) {
  return ["low", "medium", "high"].includes(priority);
}
function isValidStatus(status) {
  return ["pending", "completed", "archived"].includes(status);
}
function isValidDate(date) {
  return !date || !isNaN(Date.parse(date));
}
function sanitize(str) {
  if (typeof str !== "string") return str;
  return str.replace(/[<>"'`]/g, "");
}

// YAML-based documentation loading
const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = YAML.load("./openapi.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Get all todos (with optional filters, sorting, pagination)
app.get("/todos", (req, res) => {
  let {
    status,
    priority,
    tags,
    sortBy,
    sortOrder = "asc",
    page = 1,
    limit = 10,
    includeArchived = "false",
  } = req.query;
  let { todos } = readDB();
  if (includeArchived !== "true") {
    todos = todos.filter((t) => t.status !== "archived");
  }
  if (status) todos = todos.filter((t) => t.status === status);
  if (priority) todos = todos.filter((t) => t.priority === priority);
  if (tags) {
    const tagArr = tags.split(",");
    todos = todos.filter(
      (t) => t.tags && tagArr.some((tag) => t.tags.includes(tag))
    );
  }
  if (sortBy === "due_date")
    todos.sort((a, b) => (a.due_date || "").localeCompare(b.due_date || ""));
  if (sortBy === "priority")
    todos.sort((a, b) => a.priority.localeCompare(b.priority));
  if (sortOrder === "desc") todos.reverse();
  // Pagination
  page = parseInt(page);
  limit = parseInt(limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paged = todos.slice(start, end);
  res.json({ total: todos.length, page, limit, todos: paged });
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
  let {
    title,
    description,
    due_date,
    priority = "medium",
    tags = [],
  } = req.body;
  title = sanitize(title);
  description = sanitize(description);
  if (!title) return res.status(400).json({ error: "Title is required" });
  if (!isValidPriority(priority))
    return res.status(400).json({ error: "Invalid priority" });
  if (!isValidDate(due_date))
    return res.status(400).json({ error: "Invalid due_date" });
  if (!Array.isArray(tags))
    return res.status(400).json({ error: "Tags must be an array" });
  const newTodo = {
    id: uuidv4(),
    title,
    description,
    status: "pending",
    due_date,
    priority,
    tags: tags.map(sanitize),
  };
  const db = readDB();
  db.todos.push(newTodo);
  writeDB(db);
  res.status(201).json(newTodo);
});

// Update a todo (including soft delete/archive)
app.put("/todos/:id", (req, res) => {
  const db = readDB();
  const idx = db.todos.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const update = req.body;
  if (update.priority && !isValidPriority(update.priority))
    return res.status(400).json({ error: "Invalid priority" });
  if (update.status && !isValidStatus(update.status))
    return res.status(400).json({ error: "Invalid status" });
  if (update.due_date && !isValidDate(update.due_date))
    return res.status(400).json({ error: "Invalid due_date" });
  if (update.tags && !Array.isArray(update.tags))
    return res.status(400).json({ error: "Tags must be an array" });
  if (update.title) update.title = sanitize(update.title);
  if (update.description) update.description = sanitize(update.description);
  if (update.tags) update.tags = update.tags.map(sanitize);
  db.todos[idx] = { ...db.todos[idx], ...update };
  writeDB(db);
  res.json(db.todos[idx]);
});

// Soft delete (archive) a todo
app.delete("/todos/:id", (req, res) => {
  const db = readDB();
  const idx = db.todos.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  db.todos[idx].status = "archived";
  writeDB(db);
  res.json(db.todos[idx]);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
