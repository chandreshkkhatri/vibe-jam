# Todo App

A simple yet powerful todo application to help you manage your tasks efficiently. This application allows users to create, update, delete, and track their tasks with support for priorities, due dates, and tags.

## Features

- **Task Management**: Create, read, update, and delete todo items.
  - Each todo includes:
    - Title (required)
    - Description (optional)
    - Status: Pending or Completed (can be archived)
    - Due date (optional)
    - Priority: Low, Medium, High
    - Tags: Multiple, user-defined
- **Filtering & Sorting**:
  - Filter todos by status, priority, or tags.
  - Sort todos by due date or priority.
- **Responsive UI**: Intuitive and easy-to-use interface.
- **Persistent Storage**: Tasks are saved and loaded from a local JSON file (`db.json`).

## Screenshots

Here's a glimpse of the application across different screen sizes:

**Desktop View (Main Todo List):**
![Desktop View - Todo List](./assets/Screenshot%202025-06-02%20at%2011.00.33%20PM.png)

**Mobile View (Creating/Editing a Todo):**
![Mobile View - Create or Edit Todo Form](./assets/Screenshot%202025-06-02%20at%2011.00.59%20PM.png)

**Tablet View (Filtering Todos):**
![Tablet View - Filtering Todos](./assets/Screenshot%202025-06-02%20at%2011.01.41%20PM.png)

## Tech Stack

- **Backend**: Node.js, Express.js
  - Handles API requests for CRUD operations.
  - Data stored in a `db.json` file.
  - API documentation available via Swagger UI at `/api-docs`.
- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
  - Provides a dynamic and responsive user interface.
  - Communicates with the backend API to manage todos.

## Project Structure

```
.
├── DESIGN.md
├── PRD.md
├── README.md
├── assets/
│   ├── Screenshot 2025-06-02 at 11.00.33 PM.png
│   ├── Screenshot 2025-06-02 at 11.00.59 PM.png
│   └── Screenshot 2025-06-02 at 11.01.41 PM.png
├── nextjs-frontend/      # Frontend application
│   ├── ... (Next.js project files)
│   └── src/
│       ├── app/
│       ├── components/
│       ├── lib/
│       └── types/
└── nodejs-backend/       # Backend API
    ├── db.json
    ├── index.js
    ├── index.test.js
    ├── openapi.yaml
    └── package.json
```

## Setup and Running the Project

To get this project up and running on your local machine, follow these steps:

### Prerequisites

- Node.js (v18 or later recommended)
- npm (usually comes with Node.js)

### 1. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd nodejs-backend
npm install
```

To start the backend server (defaults to port 3000, but the frontend expects it on 3001):

```bash
PORT=3001 npm start
```

The backend API will be running at `http://localhost:3001`.
You can view the API documentation at `http://localhost:3001/api-docs`.

To run backend tests:

```bash
npm test
```

### 2. Frontend Setup

In a new terminal window, navigate to the frontend directory and install dependencies:

```bash
cd ../nextjs-frontend
npm install
```

To start the frontend development server (defaults to port 3000):

```bash
npm run dev
```

The frontend application will be accessible at `http://localhost:3000`.

**Note**: The frontend is configured to communicate with the backend API at `http://localhost:3001`. Ensure the `NEXT_PUBLIC_API_URL` in `nextjs-frontend/.env.local` (if you create one) or the default in `nextjs-frontend/src/lib/api.ts` points to the correct backend URL. By default, it's set to `http://localhost:3001`.

## API Endpoints

The backend provides the following API endpoints (as defined in `openapi.yaml`):

- `GET /todos`: List all todos (supports filtering, sorting, pagination)
- `GET /todos/:id`: Get a single todo by ID
- `POST /todos`: Create a new todo
- `PUT /todos/:id`: Update an existing todo
- `DELETE /todos/:id`: Archive a todo (soft delete)

Refer to the Swagger documentation at `/api-docs` on the running backend server for detailed request/response schemas.
