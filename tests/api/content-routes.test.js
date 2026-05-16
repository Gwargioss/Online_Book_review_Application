import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/book-service.js", () => ({
  updateBookContent: vi.fn()
}));

import * as bookService from "../../src/services/book-service.js";

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

describe("content routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /api/v1/books/:bookId/content with file", async () => {
    bookService.updateBookContent.mockResolvedValue({
      _id: "b1",
      ISBN: "123",
      title: "Book",
      author: "Author",
      content: "Extracted PDF content here..."
    });

    const app = await makeApp();
    const token = await makeToken();

    const res = await request(app)
      .post("/api/v1/books/b1/content")
      .set("Authorization", `Bearer ${token}`)
      .attach("contentFile", Buffer.from("Sample TXT content"), "sample.txt");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/v1/books/:bookId/content with text", async () => {
    bookService.updateBookContent.mockResolvedValue({
      _id: "b1",
      ISBN: "123",
      title: "Book",
      author: "Author",
      content: "Direct text content"
    });

    const app = await makeApp();
    const token = await makeToken();

    const res = await request(app)
      .post("/api/v1/books/b1/content")
      .set("Authorization", `Bearer ${token}`)
      .send({ textContent: "Direct text content" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/v1/books/:bookId/content without auth should fail", async () => {
    const app = await makeApp();

    const res = await request(app)
      .post("/api/v1/books/b1/content")
      .attach("contentFile", Buffer.from("Sample"), "sample.txt");

    expect(res.status).toBe(401);
  });

  it("POST /api/v1/books/:bookId/content without content should fail", async () => {
    const app = await makeApp();
    const token = await makeToken();

    const res = await request(app)
      .post("/api/v1/books/b1/content")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
