# Simple Blogging Platform Backend

A RESTful API backend for a simple blogging platform built with Node.js, Express, and SQLite.

## Features

- 🔐 **User Authentication**: JWT-based registration and login
- 📝 **Blog Management**: Create, read, update, delete blog entries
- 👍 **Likes System**: Like and unlike blog posts
- 💬 **Comments**: Add and manage comments on blog entries
- 🔒 **Authorization**: Users can only edit/delete their own content

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Testing**: Jest + Supertest

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Blog Entries

- `GET /blogs` - List all blog entries
- `GET /blogs/:id` - Get single blog entry
- `POST /blogs` - Create new blog entry (auth required)
- `PUT /blogs/:id` - Update blog entry (auth required, owner only)
- `DELETE /blogs/:id` - Delete blog entry (auth required, owner only)

### Likes

- `POST /blogs/:id/like` - Like a blog entry (auth required)
- `DELETE /blogs/:id/like` - Unlike a blog entry (auth required)

### Comments

- `GET /blogs/:id/comments` - List comments for a blog entry
- `POST /blogs/:id/comments` - Add comment (auth required)
- `DELETE /comments/:id` - Delete comment (auth required, owner only)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create environment file:

   ```bash
   cp .env.example .env
   ```

4. Start the server:
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000`

### Development

Run with auto-reload:

```bash
npm run dev
```

### Testing

Run all tests:

```bash
npm test
```

Run specific test suite:

```bash
npm run test:integration
npm run test:comprehensive
```

## Project Structure

```
├── src/
│   ├── config/
│   │   └── database.js          # Database connection and schema
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── blogs.js             # Blog CRUD routes
│   │   ├── likes.js             # Like/unlike routes
│   │   └── comments.js          # Comment routes
│   └── utils/
│       └── helpers.js           # Utility functions
├── test.integration.js          # Basic integration tests
├── test.comprehensive.js        # Comprehensive test suite
├── server.js                    # Main server file
├── package.json
├── prd.md                       # Product Requirements Document
└── design.md                    # Technical Design Document

```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# Database Configuration (optional for SQLite)
DB_PATH=./database.sqlite
```

## Database Schema

The application uses SQLite with the following tables:

- `users` - User accounts
- `blog_entries` - Blog posts
- `likes` - Blog post likes
- `comments` - Blog post comments

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Request rate limiting
- Input validation and sanitization
- CORS protection
- Helmet security headers

## Testing

The project includes comprehensive test coverage:

- **47 total tests** covering all API endpoints
- Authentication and authorization testing
- Input validation testing
- Multi-user interaction scenarios
- Error handling and edge cases

## License

This project is licensed under the ISC License.
