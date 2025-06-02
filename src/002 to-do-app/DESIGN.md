# Design Document: Todo App

## 1. Database Design

### Todo Item

- id: string (UUID)
- title: string (required)
- description: string (optional)
- status: enum [pending, completed] (default: pending)
- due_date: date (optional)
- priority: enum [low, medium, high] (default: medium)
- tags: array of strings (optional)

#### Example (JSON):

{
"id": "uuid-1234",
"title": "Buy groceries",
"description": "Milk, eggs, bread",
"status": "pending",
"due_date": "2025-06-05",
"priority": "high",
"tags": ["shopping", "errands"]
}

## 2. API Design

### Endpoints

- `GET /todos` — List all todos (with optional filters: status, priority, tags)
- `GET /todos/:id` — Get a single todo by id
- `POST /todos` — Create a new todo
- `PUT /todos/:id` — Update an existing todo
- `DELETE /todos/:id` — Delete a todo

#### Example: Create Todo (POST /todos)

Request Body:
{
"title": "Read a book",
"description": "Finish reading 'Atomic Habits'",
"due_date": "2025-06-10",
"priority": "medium",
"tags": ["reading"]
}

## 3. UI Design

### Main Views

- Todo List View: Shows all todos, with filter and sort options.
- Todo Detail/Edit View: Create or edit a todo.

### Wireframe (Textual)

- Header: "Todo App"
- [Add Todo] button
- Filters: Status, Priority, Tags
- List of todos:
  - Title | Due Date | Priority | Tags | Status | [Edit] [Delete]
- Edit/Create Form: Fields for all todo properties

---

This design supports the requirements in the PRD and is ready for backend implementation.
