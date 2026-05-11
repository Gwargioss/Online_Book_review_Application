# Database Schema Documentation

## Database Engine
MongoDB (via Mongoose ODM)

## Collections

## 1) `users`
### Purpose
Stores application users and authentication metadata.

### Fields
- `username` (String, required, unique, lowercase, 3-32 chars)
- `name` (String, optional, max 80)
- `email` (String, optional, lowercase, max 120)
- `profilePicture` (String URL, optional, max 500)
- `passwordHash` (String, required, excluded from default selects)
- `tokenVersion` (Number, default 0)
- `createdAt` / `updatedAt` (timestamps)

### Constraints and Notes
- `username` must be unique.
- Password is never stored as plaintext.
- `tokenVersion` supports refresh-token revocation.

## 2) `books`
### Purpose
Stores book catalog entries.

### Fields
- `ISBN` (String, required, indexed)
- `title` (String, required, indexed)
- `author` (String, required, indexed)
- `createdAt` / `updatedAt` (timestamps)

### Constraints and Indexes
- Compound unique index on:
  - `ISBN`
  - `title`
  - `author`
- Supports search operations by ISBN/title/author.

## 3) `reviews`
### Purpose
Stores user reviews for books.

### Fields
- `userId` (ObjectId -> `users`, required, indexed)
- `bookId` (ObjectId -> `books`, required, indexed)
- `review_text` (String, required, max 2000)
- `createdAt` / `updatedAt` (timestamps)

### Constraints and Relationships
- Compound unique index on (`userId`, `bookId`) to enforce one review per user per book.
- Logical relationships:
  - one user -> many reviews
  - one book -> many reviews

## Relationship Summary
- `reviews.userId` references `users._id`
- `reviews.bookId` references `books._id`

## Data Integrity Rules
- Book ID is validated for review operations.
- Review operations verify target book existence where required.
- Validation layer enforces request payload structure before DB operations.
