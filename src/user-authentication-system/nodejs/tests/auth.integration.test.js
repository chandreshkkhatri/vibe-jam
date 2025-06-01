const request = require("supertest");
const app = require("../index");

describe("Authentication API Integration Tests", () => {
  const testUser = { username: "testuser", password: "TestPass123" };
  let accessToken;
  let refreshToken;

  it("should register a new user", async () => {
    const res = await request(app).post("/register").send(testUser).expect(201);
    expect(res.body).toHaveProperty("message", "User registered");
  });

  it("should not register with duplicate username", async () => {
    await request(app).post("/register").send(testUser).expect(500);
  });

  it("should login and receive tokens", async () => {
    const res = await request(app).post("/login").send(testUser).expect(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body).toHaveProperty("refreshToken");
    accessToken = res.body.accessToken;
    refreshToken = res.body.refreshToken;
  });

  it("should access protected profile with valid token", async () => {
    const res = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body).toHaveProperty("user");
    expect(res.body.user).toHaveProperty("username", testUser.username);
  });

  it("should refresh access token with valid refresh token", async () => {
    const res = await request(app)
      .post("/refresh")
      .send({ token: refreshToken })
      .expect(200);
    expect(res.body).toHaveProperty("accessToken");
    expect(res.body.accessToken).not.toBe(accessToken);
  });

  it("should reject profile access with invalid token", async () => {
    await request(app)
      .get("/profile")
      .set("Authorization", "Bearer invalidtoken")
      .expect(403);
  });

  it("should reject refresh with invalid token", async () => {
    await request(app).post("/refresh").send({ token: "invalid" }).expect(403);
  });
});
