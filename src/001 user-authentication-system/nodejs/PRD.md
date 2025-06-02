# Product Requirements Document (PRD)

## 1. Overview

A simple, secure user authentication system built with Node.js, Express, and SQLite3. Provides registration, login, and protected profile access.

## 2. Goals

- Enable users to register and authenticate securely.
- Safeguard passwords using industry best practices (salt and pepper).
- Issue time-limited JWTs for session management.
- Keep dependencies minimal and lightweight.

## 3. Features

1. **User Registration**
   - Accept `username` and `password`.
   - Hash password with bcrypt (cost factor configurable).
2. **User Login**
   - Verify credentials.
   - Return a signed JWT (expires in 1 hour).
3. **Protected Routes**
   - Middleware to verify JWT from `Authorization: Bearer <token>`.
   - Example endpoint: `/profile` returns basic user info.
4. **Token Refresh**
   - On login, issue a long-lived refresh token alongside the short-lived access token.
   - Expose a `/refresh` endpoint that accepts a valid refresh token and returns a new access token (and optionally a new refresh token).

## 4. Functional Requirements

- **Password Storage**
  - Use bcrypt with per-password salt (random, auto-generated).
  - Incorporate a global "pepper" before hashing:
    ```js
    const hash = await bcrypt.hash(password + process.env.PEPPER, saltRounds);
    ```
- **Database**
  - SQLite3; table `users(id, username UNIQUE, passwordHash)`.
- **JWT**
  - Sign payload `{ id, username }` with `JWT_SECRET` (stored in `.env`).
- **Refresh Tokens**
  - Generate refresh tokens with a separate secret or extended expiry (e.g. days/weeks).
  - Store/track refresh tokens server-side (in DB or in-memory) for revocation.
  - Validate incoming refresh tokens at `/refresh` and issue fresh access JWTs.

## 5. Non-Functional Requirements

- **Security**
  - Store salts via bcrypt; keep `PEPPER` and `JWT_SECRET` out of source control.
  - Use HTTPS in production.
- **Performance**
  - Bcrypt cost factor (`saltRounds`) configurable to balance security vs. latency.
- **Maintainability**
  - Clear code structure in `index.js`; separate concerns if expanding.
- **Validation**
  - Use Joi for request input validation: define and enforce schemas for all API endpoints (e.g. required fields, types, lengths).
- **Testing**
  - Integration tests covering all API endpoints using Jest & Supertest.
  - Tests runnable via `npm test` for CI/CD.

## 6. Environment & Configuration

- **Node.js** v16+
- **Dependencies**: express, sqlite3, bcrypt, jsonwebtoken, dotenv
- **Environment variables**:
  - `JWT_SECRET` – secret key for signing tokens.
  - `PEPPER` – global secret appended to passwords before hashing.

## 7. Success Metrics

- No plaintext passwords in database.
- Unauthorized requests receive `401` or `403`.
- Token expiry enforced.
- Salt + pepper implemented and documented.

---

_Last updated: June 1, 2025_
