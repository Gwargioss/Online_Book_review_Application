# API Documentation

## Base Information
- **Base URL**: `http://localhost:3000/api/v1`
- **Content-Type**: `application/json`
- **Auth mechanism**:
  - Access token via `Authorization: Bearer <token>`
  - Refresh token via HTTP-only cookie

## Response Format
### Success
```json
{
  "success": true,
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable error message",
    "details": []
  }
}
```

---

## Auth Endpoints

## `POST /auth/register`
Creates a new user account.

### Request
```json
{
  "username": "reader01",
  "password": "password123"
}
```

### Response (201)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "username": "reader01"
    }
  }
}
```

## `POST /auth/login`
Authenticates user and returns access token.

### Request
```json
{
  "username": "reader01",
  "password": "password123"
}
```

### Response (200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "username": "reader01"
    },
    "token": "jwt_access_token"
  }
}
```

## `POST /auth/refresh`
Returns a new access token using refresh cookie.

### Response (200)
```json
{
  "success": true,
  "data": {
    "token": "new_access_token"
  }
}
```

## `GET /auth/me` (Protected)
Returns current authenticated user profile.

## `PUT /auth/profile` (Protected)
Updates authenticated user profile.

### Request
```json
{
  "name": "Reader Name",
  "email": "reader@mail.com",
  "profilePicture": "https://example.com/avatar.png"
}
```

## `POST /auth/logout` (Protected)
Revokes session and clears refresh cookie.

---

## Book Endpoints

## `GET /books`
Returns paginated books list.

### Query Params
- `page` (optional, int)
- `limit` (optional, int, max 60)

## `POST /books`
Publishes a new book.

### Request
```json
{
  "ISBN": "9780132350884",
  "title": "Clean Code",
  "author": "Robert C. Martin"
}
```

## `POST /books/byISBN`
Search books by ISBN.

## `POST /books/byTitle`
Search books by title.

## `POST /books/byAuthor`
Search books by author.

---

## Review Endpoints

## `GET /books/:id/reviews`
Lists reviews for a specific book.

## `PUT /books/:id/reviews` (Protected)
Creates or updates authenticated user's review for the book.

### Request
```json
{
  "review_text": "Excellent and practical book."
}
```

## `DELETE /books/:id/reviews` (Protected)
Deletes authenticated user's review for the book.

---

## HTTP Status Usage
- `200`: successful request
- `201`: resource created
- `401`: unauthorized / invalid token
- `404`: resource not found
- `409`: conflict (e.g., duplicate book/user)
- `422`: validation error
- `500`: internal server error

## Usage Guidelines / Best Practices
- Always send access token for protected endpoints.
- Handle `401` by triggering refresh flow in client.
- Validate user input on frontend before calling API.
- Use pagination on books endpoint to avoid large payloads.
- Surface API error messages to users in a readable way.
