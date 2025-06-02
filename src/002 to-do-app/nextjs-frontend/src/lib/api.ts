import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoFilters,
  TodosResponse,
} from "@/types/todo";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class TodoAPI {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async getTodos(filters: TodoFilters = {}): Promise<TodosResponse> {
    const searchParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    const endpoint = `/todos${queryString ? `?${queryString}` : ""}`;

    return this.request<TodosResponse>(endpoint);
  }

  async getTodo(id: string): Promise<Todo> {
    return this.request<Todo>(`/todos/${id}`);
  }

  async createTodo(todo: CreateTodoRequest): Promise<Todo> {
    return this.request<Todo>("/todos", {
      method: "POST",
      body: JSON.stringify(todo),
    });
  }

  async updateTodo(id: string, updates: UpdateTodoRequest): Promise<Todo> {
    return this.request<Todo>(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  async deleteTodo(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/todos/${id}`, {
      method: "DELETE",
    });
  }
}

export const todoAPI = new TodoAPI();
