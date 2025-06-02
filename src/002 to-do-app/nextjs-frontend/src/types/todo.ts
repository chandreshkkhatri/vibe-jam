export interface Todo {
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

export interface CreateTodoRequest {
  title: string;
  description?: string;
  due_date?: string;
  priority: "low" | "medium" | "high";
  tags?: string[];
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  due_date?: string;
  priority?: "low" | "medium" | "high";
  status?: "pending" | "in-progress" | "completed" | "archived";
  tags?: string[];
}

export interface TodoFilters {
  status?: string;
  priority?: string;
  tags?: string;
  sort?: "due_date" | "priority" | "created_at";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface TodosResponse {
  todos: Todo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
