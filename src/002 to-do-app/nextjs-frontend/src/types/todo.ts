export interface Todo {
  id: string;
  title: string;
  description?: string;
  due_date?: string; // ISO date string
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "archived";
  tags?: string[];
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
  status?: "pending" | "completed" | "archived";
  tags?: string[];
}

export interface TodoFilters {
  status?: string;
  priority?: string;
  tags?: string;
  sortBy?: "due_date" | "priority";
  sortOrder?: "asc" | "desc";
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
