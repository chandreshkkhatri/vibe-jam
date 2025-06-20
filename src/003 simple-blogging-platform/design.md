# Design Document: Simple Blogging Platform Backend

## 1. Overview

This document describes the technical design for the backend of the Simple Blogging Platform, addressing the requirements in the PRD.

## 2. Architecture

- **API Layer**: RESTful API endpoints for all core features
- **Authentication**: JWT-based authentication
- **Database**: Relational (e.g., PostgreSQL or SQLite for simplicity)
- **ORM**: Use an ORM (e.g., Sequelize, Prisma, or TypeORM)

## 3. Data Models

### User

- id (PK)
- email (unique)
- password_hash
- created_at
- updated_at

### BlogEntry

- id (PK)
- title
- content
- author_id (FK to User)
- created_at
- updated_at

### Like

- id (PK)
- user_id (FK to User)
- blog_entry_id (FK to BlogEntry)
- created_at

### Comment

- id (PK)
- content
- author_id (FK to User)
- blog_entry_id (FK to BlogEntry)
- created_at
- updated_at

## 4. API Endpoints

### Auth

- POST /auth/register — Register new user
- POST /auth/login — Login and receive JWT
- POST /auth/logout — (Optional, for token blacklist)

### Blog Entries

- GET /blogs — List all blog entries
- GET /blogs/:id — Get single blog entry
- POST /blogs — Create new blog entry (auth required)
- PUT /blogs/:id — Edit blog entry (auth, owner only)
- DELETE /blogs/:id — Delete blog entry (auth, owner only)

### Likes

- POST /blogs/:id/like — Like a blog entry (auth required)
- DELETE /blogs/:id/like — Unlike a blog entry (auth required)

### Comments

- GET /blogs/:id/comments — List comments for a blog entry
- POST /blogs/:id/comments — Add comment (auth required)
- DELETE /comments/:id — Delete comment (auth, owner only)

## 5. Authentication & Authorization

- Passwords hashed with bcrypt or Argon2
- JWT tokens for session management
- Middleware to protect routes and check ownership

## 6. Error Handling & Validation

- Input validation on all endpoints
- Standardized error responses (HTTP status codes, error messages)

## 7. Security Considerations

- Rate limiting on auth endpoints
- Secure password storage
- Input sanitization to prevent SQL injection/XSS

## 8. Deployment

- Environment variables for secrets/config
- Dockerfile for containerization (optional)

## 9. Future Considerations

- Media uploads (images, videos)
- User profiles
- Tagging, categories, and search
- Admin/moderator roles
- Rich text editing
- API rate limiting and monitoring

---
