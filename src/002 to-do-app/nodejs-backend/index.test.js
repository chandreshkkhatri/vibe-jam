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
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
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
});
