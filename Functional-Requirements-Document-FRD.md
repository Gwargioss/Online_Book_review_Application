# Functional Requirements Document (FRD)

## 1. Purpose
This document defines system behavior from a user perspective for BookVerse.

## 2. Primary Functional Requirements

## FR-1: User Registration and Secure Access Control
### Description
Users must be able to register, login, maintain a session, access protected features, and logout safely.

### Inputs
- Username and password for registration/login
- Access token in `Authorization` header for protected routes
- Refresh cookie for session renewal

### Processing
- Validate credentials and input formats.
- Hash password before storing user.
- Generate JWT access token and refresh token.
- Validate token on protected endpoints.
- Refresh access token when expired.
- Revoke refresh sessions on logout.

### Outputs
- Successful auth response payload with user/token data.
- Meaningful error messages for invalid credentials, unauthorized access, or expired sessions.

### Acceptance Criteria
- Registration creates user and returns `201`.
- Login returns token and sets refresh cookie.
- Protected endpoints require valid bearer token.
- Refresh returns new access token.
- Logout invalidates current refresh flow.

## FR-2: Book and Review Management
### Description
Users must be able to browse/search books and interact with reviews per book.

### Inputs
- Query params for book pagination
- Search payloads (`ISBN`, `title`, `author`)
- Book ID path parameter for review endpoints
- Review text payload

### Processing
- Validate payloads and IDs.
- List/publish/search books.
- List reviews by book.
- Upsert/delete authenticated user's review for a target book.

### Outputs
- Book lists with pagination metadata.
- Search results by different criteria.
- Reviews list and review operation status.

### Acceptance Criteria
- Books are returned through list and search endpoints.
- Authenticated user can add/update/delete own review.
- Non-authenticated users cannot modify reviews.
- Invalid request payloads return structured validation errors.

## 3. Supporting Functional Requirements
- Dashboard view available only for authenticated users.
- Profile page supports view and update of:
  - name
  - email
  - profile picture URL
- Forms must show validation errors and submit failures.
- App routing must redirect unknown routes safely.

## 4. Non-Functional Behavior Observed by Users
- Clear error messages for common failures.
- Responsive interface for multiple screen sizes.
- Stable session experience through token refresh mechanism.
