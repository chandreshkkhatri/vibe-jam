const request = require("supertest");
const express = require("express");
const fs = require("fs");
const path = require("path");

// Use the actual server.js app
let app;

beforeAll(() => {
  // Remove and re-init the database for a clean slate
  const dbPath = path.join(__dirname, "../database.sqlite");
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  app = require("../server");
});

describe("Input Sanitization Tests", () => {
  let token;

  beforeAll(async () => {
    // Register and login a user to get a token
    await request(app)
      .post("/auth/register")
      .send({ email: "test@example.com", password: "password123" });
    
    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });
    
    token = loginRes.body.token;
  });  it("sanitizes XSS attempts in blog title and content", async () => {
    const maliciousTitle = "Test Title <script>alert('xss')</script>";
    const maliciousContent = "Content with <script>malicious code</script> and <img onerror='alert(1)' src='x'>";
    
    const res = await request(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        title: maliciousTitle, 
        content: maliciousContent 
      });
    
    expect(res.statusCode).toBe(201);
    // Check that dangerous tags and scripts are completely removed
    expect(res.body.title).toBe("Test Title ");
    expect(res.body.content).toBe("Content with  and ");
  });

  it("sanitizes XSS attempts in blog updates", async () => {
    // First create a blog
    const createRes = await request(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        title: "Original Title", 
        content: "Original Content" 
      });
    
    const blogId = createRes.body.id;
      // Now try to update with malicious content
    const maliciousTitle = "Updated <script>alert('hack')</script> Title";
    const maliciousContent = "Updated <iframe src='javascript:alert(1)'></iframe> content";
    
    const updateRes = await request(app)
      .put(`/blogs/${blogId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        title: maliciousTitle, 
        content: maliciousContent 
      });
    
    expect(updateRes.statusCode).toBe(200);
    
    // Verify the sanitization by fetching the blog
    const getRes = await request(app)
      .get(`/blogs/${blogId}`);
    
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body.title).toBe("Updated  Title");
    expect(getRes.body.content).toBe("Updated  content");
  });

  it("handles normal content without issues", async () => {
    const normalTitle = "A perfectly normal title";
    const normalContent = "This is normal content with no HTML tags.";
    
    const res = await request(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        title: normalTitle, 
        content: normalContent 
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(normalTitle);
    expect(res.body.content).toBe(normalContent);
  });

  it("trims whitespace from input", async () => {
    const titleWithSpaces = "  Title with spaces  ";
    const contentWithSpaces = "  Content with spaces  ";
    
    const res = await request(app)
      .post("/blogs")
      .set("Authorization", `Bearer ${token}`)
      .send({ 
        title: titleWithSpaces, 
        content: contentWithSpaces 
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Title with spaces");
    expect(res.body.content).toBe("Content with spaces");
  });
});
