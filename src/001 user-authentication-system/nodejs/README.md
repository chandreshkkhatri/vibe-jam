# User Authentication System

A simple, secure user authentication API built with Node.js, Express, and SQLite3. Supports user registration, login (with JWT access & refresh tokens), protected profile route, and interactive API docs via Swagger UI.

## Features

- **User Registration**: Sign up with a unique username & password (bcrypt + salt/pepper).
- **User Login**: Obtain short-lived JWT access token and long-lived refresh token.
- **Token Refresh**: Exchange refresh token for a new access token.
- **Protected Routes**: Example `/profile` endpoint requires a valid access token.
- **API Docs**: Browse interactive docs at `/docs` (Swagger UI).

## Prerequisites

- Node.js v16+
- npm (Node Package Manager)

## Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone <repo-url>
   cd src/user-authentication-system/nodejs
   npm install
   ```
2. Copy example environment file and set your secrets:
   ```bash
   cp .env.example .env
   # edit .env and fill in values
   ```
3. (Optional) Configure `SALT_ROUNDS`, `PEPPER`, `JWT_SECRET`, and `REFRESH_TOKEN_SECRET` in `.env`.

## Running the Server

Start the API server on port 8000:

```bash
npm start
```

- API endpoints:
  - `POST /register`
  - `POST /login`
  - `POST /refresh`
  - `GET /profile`
- API docs: http://localhost:8000/docs

## Testing

Run integration tests (Jest & Supertest):

```bash
npm test
```

## Project Structure

```
index.js         # Main server file
openapi.yaml     # OpenAPI spec for Swagger UI
package.json     # npm config & scripts
PRD.md           # Product Requirements Document
README.md        # You are here
tests/           # Integration tests
  auth.integration.test.js
```

## License

ISC
