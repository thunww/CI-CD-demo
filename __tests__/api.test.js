const request = require("supertest");
const app = require("../app");

// ============================================
// MOCK MODELS (Sequelize không chạy DB thật)
// ============================================
jest.mock("../models");
const { User } = require("../models");

// ============================================
// MOCK JWT FUNCTIONS
// ============================================
jest.mock("../utils/jwt", () => ({
  generateToken: () => "mocked-jwt-token",
}));

// ============================================
// MOCK JWT MIDDLEWARE (verifyToken)
// ============================================
jest.mock("../middleware/auth", () => ({
  verifyToken: (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) return res.status(401).json({ error: "No token provided" });

    if (header === "Bearer invalid-token")
      return res.status(401).json({ error: "Invalid or expired token" });

    // Token hợp lệ
    req.user = { email: "admin@gmail.com" };
    next();
  },
}));

// ============================================
// LOGIN TESTS
// ============================================
describe("POST /api/auth/login (MOCK DB)", () => {
  test("Login success", async () => {
    User.findOne.mockResolvedValue({
      email: "admin@gmail.com",
      password: "123456",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@gmail.com", password: "123456" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token", "mocked-jwt-token");
  });

  test("Login fail missing fields", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Missing fields");
  });

  test("Login fail user not found", async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "notfound@gmail.com", password: "123456" });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe("User not found");
  });

  test("Login fail wrong password", async () => {
    User.findOne.mockResolvedValue({
      email: "admin@gmail.com",
      password: "123456",
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "admin@gmail.com", password: "wrongpass" });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid credentials");
  });
});

// ============================================
// PUBLIC PRODUCTS ROUTE
// ============================================
describe("GET /api/products", () => {
  test("Should return product list", async () => {
    const res = await request(app).get("/api/products");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

// ============================================
// PROTECTED ROUTE (MOCK JWT)
// ============================================
describe("GET /api/products/secret", () => {
  test("Access granted with valid token", async () => {
    const res = await request(app)
      .get("/api/products/secret")
      .set("Authorization", "Bearer mocked-jwt-token");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("secret");
    expect(res.body).toHaveProperty("user");
  });

  test("Should block when missing token", async () => {
    const res = await request(app).get("/api/products/secret");

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("No token provided");
  });

  test("Should block when invalid token", async () => {
    const res = await request(app)
      .get("/api/products/secret")
      .set("Authorization", "Bearer invalid-token");

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid or expired token");
  });
});
