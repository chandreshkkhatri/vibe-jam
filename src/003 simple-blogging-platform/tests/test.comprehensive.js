const request = require("supertest");
const fs = require("fs");
const path = require("path");

let app;

beforeAll(() => {
  const dbPath = path.join(__dirname, "../database.sqlite");
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  app = require("../server");
});

describe("Comprehensive Blogging Platform API Tests", () => {
  let user1Token, user2Token;
  let user1BlogId, user2BlogId;
  let user1CommentId, user2CommentId;

  describe("Authentication System", () => {
    describe("User Registration", () => {
      it("registers first user successfully", async () => {
        const res = await request(app)
          .post("/auth/register")
          .send({ email: "user1@example.com", password: "password123" });
        expect(res.statusCode).toBe(201);
        expect(res.body.user.email).toBe("user1@example.com");
        expect(res.body.token).toBeDefined();
        user1Token = res.body.token;
      });

      it("registers second user successfully", async () => {
        const res = await request(app)
          .post("/auth/register")
          .send({ email: "user2@example.com", password: "password456" });
        expect(res.statusCode).toBe(201);
        expect(res.body.user.email).toBe("user2@example.com");
        expect(res.body.token).toBeDefined();
        user2Token = res.body.token;
      });

      it("rejects duplicate email registration", async () => {
        const res = await request(app)
          .post("/auth/register")
          .send({ email: "user1@example.com", password: "differentpass" });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/already in use/i);
      });

      it("rejects weak password", async () => {
        const res = await request(app)
          .post("/auth/register")
          .send({ email: "weak@example.com", password: "123" });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toBeDefined();
      });

      it("rejects invalid email format", async () => {
        const res = await request(app)
          .post("/auth/register")
          .send({ email: "invalid-email", password: "password123" });
        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toBeDefined();
      });
    });

    describe("User Login", () => {
      it("logs in with correct credentials", async () => {
        const res = await request(app)
          .post("/auth/login")
          .send({ email: "user1@example.com", password: "password123" });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
      });

      it("rejects wrong password", async () => {
        const res = await request(app)
          .post("/auth/login")
          .send({ email: "user1@example.com", password: "wrongpassword" });
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/invalid credentials/i);
      });

      it("rejects non-existent user", async () => {
        const res = await request(app)
          .post("/auth/login")
          .send({ email: "nonexistent@example.com", password: "password123" });
        expect(res.statusCode).toBe(401);
        expect(res.body.error).toMatch(/invalid credentials/i);
      });
    });

    describe("Authentication Required", () => {
      it("rejects unauthenticated blog creation", async () => {
        const res = await request(app)
          .post("/blogs")
          .send({ title: "Unauthorized Post", content: "Should fail" });
        expect(res.statusCode).toBe(401);
      });

      it("rejects invalid token", async () => {
        const res = await request(app)
          .post("/blogs")
          .set("Authorization", "Bearer invalid-token")
          .send({ title: "Unauthorized Post", content: "Should fail" });
        expect(res.statusCode).toBe(401);
      });
    });
  });

  describe("Blog Entry Management", () => {
    describe("Create Blog Entry", () => {
      it("creates blog entry for user1", async () => {
        const res = await request(app)
          .post("/blogs")
          .set("Authorization", `Bearer ${user1Token}`)
          .send({ title: "User1 Blog", content: "Content by user1" });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe("User1 Blog");
        user1BlogId = res.body.id;
      });

      it("creates blog entry for user2", async () => {
        const res = await request(app)
          .post("/blogs")
          .set("Authorization", `Bearer ${user2Token}`)
          .send({ title: "User2 Blog", content: "Content by user2" });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe("User2 Blog");
        user2BlogId = res.body.id;
      });

      it("rejects empty title", async () => {
        const res = await request(app)
          .post("/blogs")
          .set("Authorization", `Bearer ${user1Token}`)
          .send({ title: "", content: "Content without title" });
        expect(res.statusCode).toBe(400);
      });

      it("rejects empty content", async () => {
        const res = await request(app)
          .post("/blogs")
          .set("Authorization", `Bearer ${user1Token}`)
          .send({ title: "Title without content", content: "" });
        expect(res.statusCode).toBe(400);
      });
    });

    describe("View Blog Entries", () => {
      it("lists all blog entries", async () => {
        const res = await request(app).get("/blogs");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(2);
        expect(res.body.some((blog) => blog.title === "User1 Blog")).toBe(true);
        expect(res.body.some((blog) => blog.title === "User2 Blog")).toBe(true);
      });

      it("gets single blog entry", async () => {
        const res = await request(app).get(`/blogs/${user1BlogId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe("User1 Blog");
        expect(res.body.content).toBe("Content by user1");
        expect(res.body.author_email).toBe("user1@example.com");
      });

      it("returns 404 for non-existent blog", async () => {
        const res = await request(app).get("/blogs/99999");
        expect(res.statusCode).toBe(404);
      });
    });

    describe("Update Blog Entry", () => {
      it("allows owner to update their blog", async () => {
        const res = await request(app)
          .put(`/blogs/${user1BlogId}`)
          .set("Authorization", `Bearer ${user1Token}`)
          .send({ title: "Updated User1 Blog", content: "Updated content" });
        expect(res.statusCode).toBe(200);
      });

      it("prevents non-owner from updating blog", async () => {
        const res = await request(app)
          .put(`/blogs/${user1BlogId}`)
          .set("Authorization", `Bearer ${user2Token}`)
          .send({ title: "Hacked Blog", content: "Unauthorized update" });
        expect(res.statusCode).toBe(403);
      });

      it("requires authentication for update", async () => {
        const res = await request(app)
          .put(`/blogs/${user1BlogId}`)
          .send({ title: "Unauthorized Update" });
        expect(res.statusCode).toBe(401);
      });
    });

    describe("Delete Blog Entry", () => {
      it("prevents non-owner from deleting blog", async () => {
        const res = await request(app)
          .delete(`/blogs/${user1BlogId}`)
          .set("Authorization", `Bearer ${user2Token}`);
        expect(res.statusCode).toBe(403);
      });

      it("allows owner to delete their blog", async () => {
        const res = await request(app)
          .delete(`/blogs/${user2BlogId}`)
          .set("Authorization", `Bearer ${user2Token}`);
        expect(res.statusCode).toBe(200);
      });
    });
  });

  describe("Likes System", () => {
    it("allows user to like a blog", async () => {
      const res = await request(app)
        .post(`/blogs/${user1BlogId}/like`)
        .set("Authorization", `Bearer ${user2Token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.likes_count).toBe(1);
    });

    it("prevents duplicate likes from same user", async () => {
      // Try to like again
      const res = await request(app)
        .post(`/blogs/${user1BlogId}/like`)
        .set("Authorization", `Bearer ${user2Token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.likes_count).toBe(1); // Should still be 1, not 2
    });

    it("allows different user to like the same blog", async () => {
      const res = await request(app)
        .post(`/blogs/${user1BlogId}/like`)
        .set("Authorization", `Bearer ${user1Token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.likes_count).toBe(2);
    });

    it("allows user to unlike a blog", async () => {
      const res = await request(app)
        .delete(`/blogs/${user1BlogId}/like`)
        .set("Authorization", `Bearer ${user2Token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.likes_count).toBe(1);
    });

    it("requires authentication for liking", async () => {
      const res = await request(app).post(`/blogs/${user1BlogId}/like`);
      expect(res.statusCode).toBe(401);
    });
  });

  describe("Comments System", () => {
    it("allows user to comment on blog", async () => {
      const res = await request(app)
        .post(`/blogs/${user1BlogId}/comments`)
        .set("Authorization", `Bearer ${user2Token}`)
        .send({ content: "Great post by user1!" });
      expect(res.statusCode).toBe(201);
      expect(res.body.content).toBe("Great post by user1!");
      user2CommentId = res.body.id;
    });

    it("allows another user to comment", async () => {
      const res = await request(app)
        .post(`/blogs/${user1BlogId}/comments`)
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ content: "Thanks for reading!" });
      expect(res.statusCode).toBe(201);
      user1CommentId = res.body.id;
    });

    it("rejects empty comment", async () => {
      const res = await request(app)
        .post(`/blogs/${user1BlogId}/comments`)
        .set("Authorization", `Bearer ${user1Token}`)
        .send({ content: "" });
      expect(res.statusCode).toBe(400);
    });

    it("lists comments for blog entry", async () => {
      const res = await request(app).get(`/blogs/${user1BlogId}/comments`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
      expect(
        res.body.some((comment) => comment.content === "Great post by user1!")
      ).toBe(true);
    });

    it("prevents non-owner from deleting comment", async () => {
      const res = await request(app)
        .delete(`/comments/${user2CommentId}`)
        .set("Authorization", `Bearer ${user1Token}`);
      expect(res.statusCode).toBe(403);
    });

    it("allows owner to delete their comment", async () => {
      const res = await request(app)
        .delete(`/comments/${user2CommentId}`)
        .set("Authorization", `Bearer ${user2Token}`);
      expect(res.statusCode).toBe(200);
    });

    it("requires authentication for commenting", async () => {
      const res = await request(app)
        .post(`/blogs/${user1BlogId}/comments`)
        .send({ content: "Unauthorized comment" });
      expect(res.statusCode).toBe(401);
    });
  });

  describe("Data Integrity", () => {
    it("includes timestamps in blog entries", async () => {
      const res = await request(app).get(`/blogs/${user1BlogId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.created_at).toBeDefined();
      expect(res.body.updated_at).toBeDefined();
    });

    it("includes author information in blog entries", async () => {
      const res = await request(app).get(`/blogs/${user1BlogId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.author_email).toBe("user1@example.com");
      expect(res.body.author_id).toBeDefined();
    });

    it("includes author information in comments", async () => {
      const res = await request(app).get(`/blogs/${user1BlogId}/comments`);
      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0].author_email).toBeDefined();
      expect(res.body[0].created_at).toBeDefined();
    });
  });
});
