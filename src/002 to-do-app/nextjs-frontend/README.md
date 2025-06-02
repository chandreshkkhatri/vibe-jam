# Todo App Frontend

A modern, responsive todo application built with Next.js, TypeScript, and Tailwind CSS that connects to a Node.js Express backend API.

## Features

- ✅ **CRUD Operations**: Create, read, update, and delete todos
- 🎯 **Priority Management**: Set priority levels (low, medium, high)
- 📅 **Due Dates**: Schedule tasks with due date tracking
- 🏷️ **Tagging System**: Organize todos with custom tags
- 🔍 **Advanced Filtering**: Filter by status, priority, and tags
- 📄 **Pagination**: Handle large numbers of todos efficiently
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚡ **Real-time Updates**: Live interaction with backend API
- 🎨 **Modern UI**: Clean, intuitive interface with Tailwind CSS

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Backend API**: Node.js Express (running on port 3001)

## Prerequisites

Before running this frontend application, ensure you have:

1. **Node.js** (version 18 or higher)
2. **npm** or **yarn** package manager
3. **Backend API** running on `http://localhost:3001`

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   # .env.local is already created with:
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Integration

This frontend connects to a Node.js Express backend with the following endpoints:

- `GET /todos` - List todos with filtering, sorting, and pagination
- `POST /todos` - Create a new todo
- `GET /todos/:id` - Get a specific todo
- `PUT /todos/:id` - Update a todo
- `DELETE /todos/:id` - Archive/soft delete a todo

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── TodoCard.tsx       # Individual todo item
│   ├── TodoForm.tsx       # Create/edit todo form
│   ├── TodoFilters.tsx    # Filtering and sorting
│   ├── TodoList.tsx       # Main todo list container
│   └── Pagination.tsx     # Pagination component
├── lib/                   # Utility libraries
│   ├── api.ts            # API client for backend
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
    └── todo.ts           # Todo-related types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Data Model

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

## Contributing

1. Follow the existing code style and TypeScript patterns
2. Use meaningful component and variable names
3. Add appropriate comments for complex logic
4. Ensure responsive design with Tailwind CSS
5. Test all CRUD operations with the backend API

## Backend Setup

This frontend requires the companion Node.js Express backend to be running. Ensure the backend is started on port 3001 before using this application.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
