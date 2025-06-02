# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Next.js TypeScript todo application frontend that connects to an existing Node.js Express backend API.

## Backend API Information

- **Base URL**: http://localhost:3001 (development)
- **Endpoints**:
  - `GET /todos` - List todos with filtering, sorting, and pagination
  - `POST /todos` - Create a new todo
  - `GET /todos/:id` - Get a specific todo
  - `PUT /todos/:id` - Update a todo
  - `DELETE /todos/:id` - Archive/soft delete a todo

## Todo Data Structure

```typescript
interface Todo {
  id: string;
  title: string;
  description?: string;
  due_date?: string; // ISO date string
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "archived";
  tags?: string[];
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}
```

## Key Features to Implement

- Todo list view with filtering and sorting
- Create and edit todo forms
- Delete/archive functionality
- Responsive design with Tailwind CSS
- Error handling and loading states
- Integration with backend API

## Coding Standards

- Use TypeScript for type safety
- Follow React best practices with hooks
- Use Tailwind CSS for styling
- Implement proper error handling
- Use meaningful component and variable names
- Add appropriate comments for complex logic
