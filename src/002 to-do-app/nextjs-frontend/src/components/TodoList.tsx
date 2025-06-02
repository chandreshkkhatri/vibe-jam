"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, RefreshCw, AlertTriangle, CheckCircle } from "lucide-react";
import {
  Todo,
  TodoFilters,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "@/types/todo";
import { todoAPI } from "@/lib/api";
import TodoCard from "./TodoCard";
import TodoForm from "./TodoForm";
import TodoFiltersComponent from "./TodoFilters";
import Pagination from "./Pagination";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState<TodoFilters>({
    page: 1,
    limit: 10,
  });

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoAPI.getTodos(filters);
      setTodos(response.todos);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch todos");
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleFiltersChange = (newFilters: TodoFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };
  const handleCreateTodo = async (todoData: CreateTodoRequest) => {
    try {
      setFormLoading(true);
      await todoAPI.createTodo(todoData);
      await fetchTodos();
      setShowForm(false);
    } catch (err) {
      throw err; // Let the form handle the error
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditTodo = async (todoData: UpdateTodoRequest) => {
    if (!editingTodo) return;

    try {
      setFormLoading(true);
      await todoAPI.updateTodo(editingTodo.id, todoData);
      await fetchTodos();
      setEditingTodo(null);
    } catch (err) {
      throw err; // Let the form handle the error
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormSave = async (
    todoData: CreateTodoRequest | UpdateTodoRequest
  ) => {
    if (editingTodo) {
      await handleEditTodo(todoData as UpdateTodoRequest);
    } else {
      await handleCreateTodo(todoData as CreateTodoRequest);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (!confirm("Are you sure you want to archive this todo?")) return;

    try {
      await todoAPI.deleteTodo(id);
      await fetchTodos();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete todo");
    }
  };

  const handleStatusChange = async (id: string, status: Todo["status"]) => {
    try {
      await todoAPI.updateTodo(id, { status });
      await fetchTodos();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update todo status"
      );
    }
  };

  const handleRefresh = () => {
    fetchTodos();
  };

  const completedTodosCount = todos.filter(
    (todo) => todo.status === "completed"
  ).length;
  const overdueTodosCount = todos.filter((todo) => {
    if (!todo.due_date || todo.status === "completed") return false;
    return new Date(todo.due_date) < new Date();
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Todo App</h1>
              <p className="mt-2 text-gray-600">
                Manage your tasks efficiently with priorities, due dates, and
                tags.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                <RefreshCw
                  className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Todo
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Todos
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {pagination.total}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Completed
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {completedTodosCount}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Overdue
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {overdueTodosCount}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Filters */}
        <div className="mb-6">
          <TodoFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            totalCount={pagination.total}
          />
        </div>
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600"
                >
                  <span className="sr-only">Dismiss</span>×
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading todos...</span>
          </div>
        )}
        {/* Empty State */}
        {!loading && todos.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No todos found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {Object.keys(filters).some(
                (key) =>
                  filters[key as keyof TodoFilters] &&
                  key !== "page" &&
                  key !== "limit"
              )
                ? "Try adjusting your filters or"
                : "Get started by creating your first todo."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Todo
              </button>
            </div>
          </div>
        )}
        {/* Todo List */}
        {!loading && todos.length > 0 && (
          <div className="space-y-4">
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onEdit={setEditingTodo}
                onDelete={handleDeleteTodo}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
        {/* Pagination */}
        {!loading && todos.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
            />
          </div>
        )}{" "}
        {/* Todo Form Modal */}
        {(showForm || editingTodo) && (
          <TodoForm
            todo={editingTodo || undefined}
            onSave={handleFormSave}
            onCancel={() => {
              setShowForm(false);
              setEditingTodo(null);
            }}
            isLoading={formLoading}
          />
        )}
      </div>
    </div>
  );
}
