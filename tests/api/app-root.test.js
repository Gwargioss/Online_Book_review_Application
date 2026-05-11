import request from "supertest";
import { describe, expect, it } from "vitest";

function applyTestEnv() {
  process.env.NODE_ENV = "test";
  process.env.MONGODB_URI = "mongodb://localhost:27017/easybooking-test";
  process.env.ACCESS_TOKEN_SECRET = "test-access-secret";
  process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret";
}

async function makeApp() {
  applyTestEnv();
  const { createApp } = await import("../../src/app.js");
  return createApp();
}

describe("app root", () => {
  it("GET / returns 200", async () => {
    const app = await makeApp();
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
  });
});
