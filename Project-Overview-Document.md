# Project Overview Document

## Project Title
BookVerse - Online Book Review Application

## Introduction
BookVerse is a full-stack web application that enables users to discover books, manage personal accounts, and create reviews for books. The system is designed as a client-server architecture where a React SPA consumes a Node.js/Express REST API backed by MongoDB.

## Objectives
- Provide secure user registration and authentication.
- Allow users to browse and search books efficiently.
- Enable authenticated users to create, update, and delete their own reviews.
- Provide a dashboard and profile management experience for authenticated users.
- Maintain a modular architecture that can scale to enterprise-level patterns.

## Scope
### In Scope
- Authentication (register, login, refresh, logout, profile fetch/update)
- Book listing, publish, and search operations
- Review listing and user-owned review management
- SPA routing, protected routes, responsive UI, Formik-based forms
- Validation, centralized error handling, tests, lint/build scripts

### Out of Scope
- Payment workflows
- External recommendation engines
- Advanced role hierarchies beyond the current auth flow
- Third-party social login providers

## Entities and Roles
- **Guest User**
  - Browse books and read reviews
  - Register or login
- **Authenticated User**
  - Access dashboard
  - Publish books
  - Write/edit/delete own reviews
  - View/update profile (name, email, profile picture)
- **System**
  - Validates requests
  - Secures routes with JWT
  - Persists data in MongoDB
  - Returns standardized API responses

## Success Criteria
- Core API endpoints respond correctly with proper status codes.
- Protected endpoints reject unauthorized requests.
- UI supports complete flow from registration to review management.
- Test suite, lint, and build pass successfully.
