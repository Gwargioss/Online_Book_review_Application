import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/review-service.js", () => ({
  listReviews: vi.fn(),
  createReview: vi.fn(),
  deleteReview: vi.fn()
}));

import * as reviewService from "../../src/services/review-service.js";

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

async function makeToken() {
  applyTestEnv();
  const { signAccessToken } = await import("../../src/utils/jwt.js");
  return signAccessToken({ sub: "507f1f77bcf86cd799439011", username: "reader", tokenVersion: 0 });
}

describe("review routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/v1/books/:id/reviews", async () => {
    reviewService.listReviews.mockResolvedValue({ reviews: [{ id: "r1", review_text: "Good read" }] });
    const app = await makeApp();

    const res = await request(app).get("/api/v1/books/507f1f77bcf86cd799439011/reviews");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("PUT /api/v1/books/:id/reviews", async () => {
    reviewService.createReview.mockResolvedValue({ saved: true });
    const app = await makeApp();
    const token = await makeToken();

    const res = await request(app)
      .put("/api/v1/books/507f1f77bcf86cd799439011/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ review_text: "Excellent!", rating: 4 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("DELETE /api/v1/books/:id/reviews/:reviewId", async () => {
    reviewService.deleteReview.mockResolvedValue({ deleted: true });
    const app = await makeApp();
    const token = await makeToken();

    const res = await request(app)
      .delete("/api/v1/books/507f1f77bcf86cd799439011/reviews/507f1f77bcf86cd799439012")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
