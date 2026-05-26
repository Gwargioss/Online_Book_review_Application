import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../src/services/book-service.js", () => ({
  listBooks: vi.fn(),
  publishBook: vi.fn(),
  deleteBook: vi.fn(),
  searchByISBN: vi.fn(),
  searchByTitle: vi.fn(),
  searchByAuthor: vi.fn()
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

describe("book routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /api/v1/books", async () => {
    bookService.listBooks.mockResolvedValue({
      items: [{ id: "b1", ISBN: "123", title: "Book", author: "Author" }],
      pagination: { page: 1, limit: 24, total: 1, pages: 1 }
    });
    const app = await makeApp();

    const res = await request(app).get("/api/v1/books");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/v1/books", async () => {
    bookService.publishBook.mockResolvedValue({
      book: { id: "b1", ISBN: "123", title: "Book", author: "Author" }
    });
    const app = await makeApp();
    const token = await makeToken();

    const res = await request(app)
      .post("/api/v1/books")
      .set("Authorization", `Bearer ${token}`)
      .send({ ISBN: "123", title: "Book", author: "Author" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("DELETE /api/v1/books/:id", async () => {
    bookService.deleteBook.mockResolvedValue({ deleted: true });
    const app = await makeApp();
    const token = await makeToken();

    const res = await request(app)
      .delete("/api/v1/books/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/v1/books/byISBN", async () => {
    bookService.searchByISBN.mockResolvedValue({ items: [{ id: "b1" }] });
    const app = await makeApp();

    const res = await request(app).post("/api/v1/books/byISBN").send({ ISBN: "123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/v1/books/byTitle", async () => {
    bookService.searchByTitle.mockResolvedValue({ items: [{ id: "b1" }] });
    const app = await makeApp();

    const res = await request(app).post("/api/v1/books/byTitle").send({ title: "Book" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("POST /api/v1/books/byAuthor", async () => {
    bookService.searchByAuthor.mockResolvedValue({ items: [{ id: "b1" }] });
    const app = await makeApp();

    const res = await request(app).post("/api/v1/books/byAuthor").send({ author: "Author" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
