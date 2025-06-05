const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");

// Use the actual server.js app
let app;

beforeAll(() => {
  // Remove and re-init the database for a clean slate
  const dbPath = path.join(__dirname, "./database.sqlite");
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  app = require("./server");
});

describe("Simple Blogging Platform API Integration", () => {
  let token;
  let blogId;
  let commentId;

  it("registers a new user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "password123" });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe("test@example.com");
    expect(res.body.token).toBeDefined();
  });

  it("logs in the user", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("creates a blog entry", async () => {
    const res = await request(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "First Post", content: "Hello world!" });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("First Post");
    blogId = res.body.id;
  });

  it("lists blog entries", async () => {
    const res = await request(app).get("/blogs");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("likes a blog entry", async () => {
    const res = await request(app)
      .post(`/blogs/${blogId}/like`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.likes_count).toBe(1);
  });

  it("unlikes a blog entry", async () => {
    const res = await request(app)
      .delete(`/blogs/${blogId}/like`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.likes_count).toBe(0);
  });

  it("adds a comment", async () => {
    const res = await request(app)
      .post(`/blogs/${blogId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "Nice post!" });
    expect(res.statusCode).toBe(201);
    expect(res.body.content).toBe("Nice post!");
    commentId = res.body.id;
  });

  it("lists comments for a blog entry", async () => {
    const res = await request(app).get(`/blogs/${blogId}/comments`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("deletes a comment", async () => {
    const res = await request(app)
      .delete(`/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/);
  });

  it("deletes a blog entry", async () => {
    const res = await request(app)
      .delete(`/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/);
  });
});
