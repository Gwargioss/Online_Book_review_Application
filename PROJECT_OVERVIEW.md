# Project Overview: Online Book Review Application (BookVerse)

## 1. Introduction, Objectives, and Scope

### Introduction

BookVerse is an online platform where users can discover books and share their opinions through reviews.  
It is built as a full-stack application with a backend API (Node.js/Express), a frontend client (React), and MongoDB for data storage.

### Objectives

- Provide a simple and secure way for users to register and log in.
- Allow users to browse, search, and publish books.
- Enable users to create and manage reviews for books.
- Offer clear API documentation for development and integration.

### Scope

This project covers core features for:

- User authentication and profile-related actions.
- Book management (listing, searching, and adding books).
- Review management (creating, updating, and deleting user reviews).
- API access and documentation support for the application endpoints.

## 2. Entities Involved and Their Roles

### User

- Represents the person using the application.
- Can register, log in, manage profile data, and interact with books and reviews.
- Authenticated users can add books and manage their own reviews.

### Book

- Represents a book record in the platform.
- Stores main book details such as ISBN, title, and author.
- Serves as the main item users search for and review.

### Review

- Represents a user’s opinion about a specific book.
- Connects a User to a Book through feedback content.
- Can be created, updated, or deleted by its author (the owning user).
