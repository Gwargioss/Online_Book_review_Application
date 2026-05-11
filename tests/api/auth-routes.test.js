import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/auth-service.js", () => ({
  register: vi.fn(),
  login: vi.fn(),
  refresh: vi.fn(),
  me: vi.fn(),
  updateProfile: vi.fn(),
  logout: vi.fn()
}));

import * as authService from "../../src/services/auth-service.js";

function applyTestEnv() {
  process.env.NODE_ENV = "test";
  process.env.MONGODB_URI = "mongodb://localhost:27017/easybooking-test";
  process.env.ACCESS_TOKEN_SECRET = "test-access-secret";
  process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";
  process.env.COOKIE_NAME = "bookverse_refresh";
}

async function makeApp() {
  applyTestEnv();
  const { createApp } = await import("../../src/app.js");
  return createApp();
}

async function makeToken() {
  applyTestEnv();
  const { signAccessToken } = await import("../../src/utils/jwt.js");
  return signAccessToken({ sub: "507f1f77bcf86cd799439011", username: "reader", tokenVersion: 0 });
}

describe("auth routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /api/v1/auth/register", async () => {
    authService.register.mockResolvedValue({ user: { id: "u1", username: "reader" } });
    const app = await makeApp();

    const res = await request(app).post("/api/v1/auth/register").send({ username: "reader", password: "password123" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/v1/auth/login", async () => {
    authService.login.mockResolvedValue({
      user: { id: "u1", username: "reader" },
      accessToken: "access-token",
      refreshToken: "refresh-token"
    });
    const app = await makeApp();

    const res = await request(app).post("/api/v1/auth/login").send({ username: "reader", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBe("access-token");
  });

  it("POST /api/v1/auth/refresh", async () => {
    authService.refresh.mockResolvedValue({ accessToken: "new-token", refreshToken: "next-refresh" });
    const app = await makeApp();

    const res = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", ["bookverse_refresh=refresh-token"]);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBe("new-token");
  });

  it("GET /api/v1/auth/me", async () => {
    authService.me.mockResolvedValue({ id: "u1", username: "reader" });
    const app = await makeApp();
    const token = await makeToken();

    const res = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("PUT /api/v1/auth/profile", async () => {
    authService.updateProfile.mockResolvedValue({
      id: "u1",
      username: "reader",
      name: "Reader Name",
      email: "reader@mail.com",
      profilePicture: "https://example.com/p.png"
    });
    const app = await makeApp();
    const token = await makeToken();

    const res = await request(app).put("/api/v1/auth/profile").set("Authorization", `Bearer ${token}`).send({
      name: "Reader Name",
      email: "reader@mail.com",
      profilePicture: "https://example.com/p.png"
    });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/v1/auth/logout", async () => {
    authService.logout.mockResolvedValue(undefined);
    const app = await makeApp();
    const token = await makeToken();

    const res = await request(app).post("/api/v1/auth/logout").set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
