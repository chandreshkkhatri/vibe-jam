const request = require("supertest");
const fs = require("fs");
const path = require("path");
let app;

const DB_PATH = path.join(__dirname, "db.json");
const TEST_DB_PATH = path.join(__dirname, "db.test.json");

beforeAll(() => {
  // Backup original db.json
  if (fs.existsSync(DB_PATH)) {
    fs.copyFileSync(DB_PATH, TEST_DB_PATH);
  }
  // Use a clean db.json for tests
  fs.writeFileSync(DB_PATH, JSON.stringify({ todos: [] }, null, 2));
  app = require("./index");
});

afterAll(() => {
  // Restore original db.json
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.copyFileSync(TEST_DB_PATH, DB_PATH);
    fs.unlinkSync(TEST_DB_PATH);
  }
});

describe("Todo API", () => {
  let server;
  beforeAll((done) => {
    server = app.listen(4000, done);
  });
  afterAll((done) => {
    server.close(done);
  });

  let todoId;

  test("POST /todos creates a todo", async () => {
    const res = await request(server)
      .post("/todos")
      .send({ title: "Test Todo", priority: "high", tags: ["test"] });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Todo");
    todoId = res.body.id;
  });

  test("GET /todos returns todos", async () => {
    const res = await request(server).get("/todos");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.todos)).toBe(true);
    expect(res.body.todos.length).toBeGreaterThan(0);
  });

  test("GET /todos/:id returns a todo", async () => {
    const res = await request(server).get(`/todos/${todoId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(todoId);
  });

  test("PUT /todos/:id updates a todo", async () => {
    const res = await request(server)
      .put(`/todos/${todoId}`)
      .send({ status: "completed" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("completed");
  });

  test("DELETE /todos/:id deletes a todo", async () => {
    const res = await request(server).delete(`/todos/${todoId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(todoId);
  });

  test("GET /todos supports filtering, sorting, pagination, and archived", async () => {
    // Create multiple todos
    await request(server)
      .post("/todos")
      .send({ title: "A", priority: "low", tags: ["x"] });
    await request(server)
      .post("/todos")
      .send({ title: "B", priority: "medium", tags: ["y"] });
    await request(server)
      .post("/todos")
      .send({ title: "C", priority: "high", tags: ["x", "y"] });
    // Archive one
    const resAll = await request(server).get("/todos");
    const toArchive = resAll.body.todos.find((t) => t.title === "A");
    await request(server).delete(`/todos/${toArchive.id}`);

    // Filter by priority
    let res = await request(server).get("/todos").query({ priority: "high" });
    expect(res.body.todos.length).toBe(1);
    expect(res.body.todos[0].priority).toBe("high");

    // Filter by tag (any match)
    res = await request(server).get("/todos").query({ tags: "x" });
    expect(res.body.todos.some((t) => t.tags.includes("x"))).toBe(true);

    // Pagination
    res = await request(server).get("/todos").query({ limit: 1, page: 2 });
    expect(res.body.todos.length).toBe(1);
    expect(res.body.page).toBe(2);

    // Exclude archived by default
    res = await request(server).get("/todos");
    expect(res.body.todos.some((t) => t.status === "archived")).toBe(false);

    // Include archived
    res = await request(server)
      .get("/todos")
      .query({ includeArchived: "true" });
    expect(res.body.todos.some((t) => t.status === "archived")).toBe(true);
  });

  test("POST /todos validates input", async () => {
    let res = await request(server).post("/todos").send({});
    expect(res.statusCode).toBe(400);
    res = await request(server)
      .post("/todos")
      .send({ title: "T", priority: "bad" });
    expect(res.statusCode).toBe(400);
    res = await request(server)
      .post("/todos")
      .send({ title: "T", due_date: "notadate" });
    expect(res.statusCode).toBe(400);
    res = await request(server)
      .post("/todos")
      .send({ title: "T", tags: "notarray" });
    expect(res.statusCode).toBe(400);
  });

  test("PUT /todos/:id validates input and supports archiving", async () => {
    const res1 = await request(server)
      .post("/todos")
      .send({ title: "ToUpdate" });
    const id = res1.body.id;
    let res = await request(server)
      .put(`/todos/${id}`)
      .send({ priority: "bad" });
    expect(res.statusCode).toBe(400);
    res = await request(server).put(`/todos/${id}`).send({ status: "bad" });
    expect(res.statusCode).toBe(400);
    res = await request(server)
      .put(`/todos/${id}`)
      .send({ due_date: "notadate" });
    expect(res.statusCode).toBe(400);
    res = await request(server).put(`/todos/${id}`).send({ tags: "notarray" });
    expect(res.statusCode).toBe(400);
    // Archive via PUT
    res = await request(server)
      .put(`/todos/${id}`)
      .send({ status: "archived" });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("archived");
  });
});
